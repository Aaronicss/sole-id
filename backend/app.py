"""
Fine-Tuned CLIP Shoe Classifier — Flask API
Loads your .pth model and exposes a /predict endpoint for the React frontend.
"""

import os
import io
import json
import base64
import torch
import torch.nn as nn
import clip
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React dev server to call this API

# ─── Config ───────────────────────────────────────────────────
MODEL_PATH = os.environ.get("MODEL_PATH", "clip_shoe_classifier_final.pth")
DEVICE     = "cuda" if torch.cuda.is_available() else "cpu"


# ─── Model Architecture (must match training notebook) ────────
class CLIPShoeClassifier(nn.Module):
    def __init__(self, clip_model, num_classes, embed_dim=768):
        super().__init__()
        self.clip_model = clip_model
        self.classifier = nn.Sequential(
            nn.LayerNorm(768),
            nn.Linear(768, 256),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, images):
        with torch.no_grad():
            features = self.clip_model.encode_image(images).float()
            features = features / features.norm(dim=-1, keepdim=True)
        return self.classifier(features)

    def predict_proba(self, images):
        return torch.softmax(self.forward(images), dim=-1)


# ─── Load model at startup ────────────────────────────────────
print(f"Loading CLIP backbone on {DEVICE}...")
clip_backbone, clip_preprocess = clip.load("ViT-L/14", device=DEVICE)
for p in clip_backbone.parameters():
    p.requires_grad = False
clip_backbone.eval()

print(f"Loading classifier from {MODEL_PATH}...")
ckpt = torch.load(MODEL_PATH, map_location=DEVICE)

model = CLIPShoeClassifier(clip_backbone, ckpt["num_classes"], ckpt["embed_dim"])
model.load_state_dict(ckpt["model_state_dict"])
model.to(DEVICE)
model.eval()

SHOE_CLASSES   = ckpt["shoe_classes"]
IDX_TO_CLASS   = ckpt["idx_to_class"]
DISPLAY_NAMES  = ckpt["display_names"]
BEST_VAL_ACC   = ckpt.get("best_val_acc", None)

print(f"✅ Model loaded — {ckpt['num_classes']} classes, val acc: {BEST_VAL_ACC:.1%}")


# ─── Routes ───────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status":    "ok",
        "device":    DEVICE,
        "classes":   len(SHOE_CLASSES),
        "val_acc":   round(BEST_VAL_ACC * 100, 2) if BEST_VAL_ACC else None,
    })


@app.route("/classes", methods=["GET"])
def get_classes():
    return jsonify({
        "classes": [
            {"id": cls, "label": DISPLAY_NAMES[cls]}
            for cls in SHOE_CLASSES
        ]
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    Accepts: multipart/form-data with field 'image' (file)
          OR JSON body with field 'image' (base64 string)
    Returns: JSON with top predictions and confidence scores
    """
    try:
        # ── Parse image ──
        if "image" in request.files:
            file  = request.files["image"]
            image = Image.open(file.stream).convert("RGB")
        elif request.is_json and "image" in request.json:
            b64   = request.json["image"].split(",")[-1]  # strip data URI prefix
            data  = base64.b64decode(b64)
            image = Image.open(io.BytesIO(data)).convert("RGB")
        else:
            return jsonify({"error": "No image provided"}), 400

        # ── Thumbnail for response ──
        thumb = image.copy()
        thumb.thumbnail((400, 400))
        buf = io.BytesIO()
        thumb.save(buf, format="JPEG", quality=85)
        thumb_b64 = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

        # ── Inference ──
        img_tensor = clip_preprocess(image).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            probs = model.predict_proba(img_tensor).cpu().numpy()[0]

        top_indices = probs.argsort()[::-1]
        predictions = [
            {
                "rank":       int(rank + 1),
                "class_id":   SHOE_CLASSES[i],
                "label":      DISPLAY_NAMES[SHOE_CLASSES[i]],
                "confidence": float(round(probs[i] * 100, 2)),
            }
            for rank, i in enumerate(top_indices)
        ]

        return jsonify({
            "success":     True,
            "top":         predictions[0],
            "predictions": predictions,
            "thumbnail":   thumb_b64,
            "image_size":  list(image.size),
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
