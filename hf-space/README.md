---
title: SoleID Shoe Classifier API
emoji: 👟
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

# SoleID — Fine-Tuned CLIP Shoe Classifier API

FastAPI backend for the SoleID shoe classification app.
Powered by a fine-tuned CLIP ViT-B/32 model.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Server status + model info |
| GET | `/classes` | All supported shoe classes |
| POST | `/predict` | Classify a shoe image |

## Environment Variables (set in Space Secrets)

| Variable | Description |
|---|---|
| `HF_REPO_ID` | Your model repo e.g. `username/sole-id-model` |
| `MODEL_FILE` | Filename of your .pth e.g. `clip_shoe_classifier_final.pth` |
| `HF_TOKEN` | Only needed if model repo is private |
| `FRONTEND_URL` | Your Vercel frontend URL for CORS |
