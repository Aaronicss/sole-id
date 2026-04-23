# 👟 SoleID — Vercel + Hugging Face Spaces Deployment Guide

```
GitHub Repo
├── hf-space/        → Hugging Face Space (FastAPI backend)
└── frontend/        → Vercel (React frontend)
```

---

## Part 1 — Upload Your Model to Hugging Face Hub

Your `.pth` file is too large for GitHub. Store it in a separate HF model repo.

### 1a. Create a model repository
1. Go to huggingface.co → New Model
2. Name it `sole-id-model` (private or public — your choice)
3. Copy your repo ID: `your-username/sole-id-model`

### 1b. Upload from Colab (after training)
Run this in the last cell of your training notebook:

```python
from huggingface_hub import HfApi, login

login()  # paste your HF token from huggingface.co/settings/tokens

api = HfApi()
api.upload_file(
    path_or_fileobj="clip_shoe_classifier_final.pth",
    path_in_repo="clip_shoe_classifier_final.pth",
    repo_id="your-username/sole-id-model",
    repo_type="model",
)
print("✅ Model uploaded!")
```

---

## Part 2 — Deploy HF Space (Backend)

### 2a. Create a new HF Space
1. Go to huggingface.co → New Space
2. **Space name:** `sole-id`
3. **SDK:** Docker
4. **Visibility:** Public

### 2b. Push the hf-space/ folder

```bash
# Clone your new empty Space
git clone https://huggingface.co/spaces/your-username/sole-id
cd sole-id

# Copy files from this project
cp path/to/sole-id/hf-space/* .

# Push
git add .
git commit -m "deploy FastAPI backend"
git push
```

### 2c. Set Space Secrets
In your Space → Settings → Repository Secrets, add:

| Secret Name   | Value |
|---------------|-------|
| `HF_REPO_ID`  | `your-username/sole-id-model` |
| `MODEL_FILE`  | `clip_shoe_classifier_final.pth` |
| `HF_TOKEN`    | Your HF token (only if model repo is private) |
| `FRONTEND_URL`| Your Vercel URL (add after Step 3) |

### 2d. Verify
Visit: `https://your-username-sole-id.hf.space/health`

Expected response:
```json
{
  "status": "ok",
  "device": "cpu",
  "classes": 8,
  "val_acc": 91.5,
  "gpu": false
}
```

---

## Part 3 — Deploy Frontend to Vercel

### 3a. Push frontend to GitHub

```bash
# From the project root
git init
git add .
git commit -m "initial commit"
gh repo create sole-id --public --push
```

### 3b. Import to Vercel
1. Go to vercel.com → Add New Project
2. Import your GitHub repo `sole-id`
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Vite ✅

### 3c. Add Environment Variable
In Vercel project → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-username-sole-id.hf.space` |

### 3d. Redeploy
Trigger a redeploy so the env var takes effect.

### 3e. Update CORS in HF Space
Go back to your HF Space secrets and update `FRONTEND_URL`:
```
FRONTEND_URL = https://your-sole-id.vercel.app
```
Then restart the Space (Settings → Factory reboot).

---

## Part 4 — Local Development

To run the full stack locally:

```bash
# Terminal 1 — FastAPI backend
cd hf-space
pip install -r requirements.txt

# Set env vars locally
export HF_REPO_ID="your-username/sole-id-model"
export MODEL_FILE="clip_shoe_classifier_final.pth"

python app.py
# → http://localhost:7860

# Terminal 2 — React frontend
cd frontend
cp .env.example .env.local   # already points to localhost:7860
npm install
npm run dev
# → http://localhost:3000
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Space shows "Building" forever | Check Dockerfile — run `docker build .` locally first |
| CORS error in browser | Add your Vercel URL to `FRONTEND_URL` secret + reboot Space |
| `hf_hub_download` fails | Check `HF_REPO_ID` spelling and that model file name matches |
| Private model 401 error | Add `HF_TOKEN` secret in Space settings |
| Cold start (~30s delay) | Normal for free HF Spaces — StatusBar shows "sleeping" warning |
| GPU needed for speed | Upgrade Space to T4 Small GPU ($0.05/hr, pay as you go) |

---

## Free Tier Limits

| Service | Free allowance |
|---|---|
| Vercel | Unlimited static deploys, 100GB bandwidth/month |
| HF Spaces | Unlimited CPU Spaces, sleeps after 48h inactivity |
| HF Hub | Unlimited model storage (no file size limit) |

**Total monthly cost: $0** for moderate traffic.
