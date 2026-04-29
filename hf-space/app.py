"""
SoleID — Fine-Tuned CLIP Shoe Classifier
Hugging Face Spaces backend (FastAPI)

HF Spaces expects:
  - This file named app.py at the root
  - A requirements.txt at the root
  - PORT exposed on 7860 (handled automatically by HF)
"""

import os
import io
import base64
import torch
import torch.nn as nn
import clip
import numpy as np
from PIL import Image
from huggingface_hub import hf_hub_download
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# ─── App ──────────────────────────────────────────────────────
app = FastAPI(title="SoleID API", version="1.0.0")

# Allow your Vercel frontend domain
# Replace with your actual Vercel URL after deploying
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://*.vercel.app",       # all Vercel preview URLs
    os.environ.get("FRONTEND_URL", ""),  # set in HF Space secrets
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Config ───────────────────────────────────────────────────
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Your HuggingFace model repo — set via HF Space secret or hardcode
HF_REPO_ID  = os.environ.get("HF_REPO_ID", "your-username/sole-id-model")
MODEL_FILE  = os.environ.get("MODEL_FILE", "clip_shoe_classifier_final.pth")
HF_TOKEN    = os.environ.get("HF_TOKEN", None)   # only needed for private repos


# ─── Model Architecture ───────────────────────────────────────
class CLIPShoeClassifier(nn.Module):
    def __init__(self, clip_model, num_classes, embed_dim=512):
        super().__init__()
        self.clip_model = clip_model
        self.classifier = nn.Sequential(
          nn.LayerNorm(768),
          nn.Linear(768, 256),
          nn.GELU(),
          nn.Dropout(0.2),
          nn.Linear(256, num_classes),
        )

    def forward(self, images):
        with torch.no_grad():
            features = self.clip_model.encode_image(images).float()
            features = features / features.norm(dim=-1, keepdim=True)
        return self.classifier(features)

    def predict_proba(self, images):
        return torch.softmax(self.forward(images), dim=-1)


# ─── Load model on startup ────────────────────────────────────
print(f"⚙️  Device: {DEVICE}")
print(f"📥 Downloading model from HuggingFace: {HF_REPO_ID}/{MODEL_FILE}")

model_path = hf_hub_download(
    repo_id=HF_REPO_ID,
    filename=MODEL_FILE,
    token=HF_TOKEN,
    cache_dir="/tmp/model_cache",
)

print("🧠 Loading CLIP backbone...")
clip_backbone, clip_preprocess = clip.load("ViT-L/14", device=DEVICE)
for p in clip_backbone.parameters():
    p.requires_grad = False
clip_backbone.eval()

print("🔧 Loading classifier head...")
ckpt = torch.load(model_path, map_location=DEVICE)

model = CLIPShoeClassifier(clip_backbone, ckpt["num_classes"], ckpt["embed_dim"])
model.load_state_dict(ckpt["model_state_dict"])
model.to(DEVICE)
model.eval()

SHOE_CLASSES  = ckpt["shoe_classes"]
IDX_TO_CLASS  = ckpt["idx_to_class"]
DISPLAY_NAMES = ckpt["display_names"]
BEST_VAL_ACC  = ckpt.get("best_val_acc", 0.0)

print(f"✅ Model ready — {ckpt['num_classes']} classes | val acc: {BEST_VAL_ACC:.1%}")


# ─── Helper ───────────────────────────────────────────────────
def image_to_base64(image: Image.Image, max_size=400) -> str:
    thumb = image.copy()
    thumb.thumbnail((max_size, max_size))
    buf = io.BytesIO()
    thumb.save(buf, format="JPEG", quality=85)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def run_inference(image: Image.Image):
    img_tensor = clip_preprocess(image).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        probs = model.predict_proba(img_tensor).cpu().numpy()[0]

    top_indices = probs.argsort()[::-1]
    predictions = [
        {
            "rank":       int(rank + 1),
            "class_id":   SHOE_CLASSES[i],
            "label":      DISPLAY_NAMES[SHOE_CLASSES[i]],
            "confidence": float(round(float(probs[i]) * 100, 2)),
        }
        for rank, i in enumerate(top_indices)
    ]
    return predictions


# ─── Routes ───────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "service": "SoleID API"}


@app.get("/health")
def health():
    return {
        "status":    "ok",
        "device":    DEVICE,
        "classes":   len(SHOE_CLASSES),
        "val_acc":   round(BEST_VAL_ACC * 100, 2),
        "gpu":       torch.cuda.is_available(),
    }


@app.get("/classes")
def get_classes():
    return {
        "classes": [
            {"id": cls, "label": DISPLAY_NAMES[cls]}
            for cls in SHOE_CLASSES
        ]
    }


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    # Validate file type
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file")

    try:
        predictions = run_inference(pil_image)
        thumbnail   = image_to_base64(pil_image)

        return JSONResponse({
            "success":     True,
            "top":         predictions[0],
            "predictions": predictions,
            "thumbnail":   thumbnail,
            "image_size":  list(pil_image.size),
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Entry point ──────────────────────────────────────────────
# HF Spaces auto-detects FastAPI and serves on port 7860
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
