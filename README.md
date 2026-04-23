# 👟 SoleID — Fine-Tuned CLIP Shoe Classifier

React frontend + Flask backend for classifying shoe models using your trained `.pth` file.

---

## Project Structure

```
shoe-classifier/
├── backend/
│   ├── app.py               ← Flask API
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── components/
    │       ├── Header.jsx / .css
    │       ├── Uploader.jsx / .css
    │       └── ResultPanel.jsx / .css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup

### 1. Backend (Flask API)

```bash
cd backend

# Copy your trained model here
cp ~/Downloads/clip_shoe_classifier_final.pth .

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API
python app.py
# → Running on http://localhost:5000
```

### 2. Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# → Running on http://localhost:3000
```

Then open **http://localhost:3000** in your browser.

---

## API Endpoints

| Method | Endpoint   | Description                        |
|--------|------------|------------------------------------|
| GET    | /health    | Check server status + model info   |
| GET    | /classes   | List all shoe classes              |
| POST   | /predict   | Classify a shoe image              |

### POST /predict

**Request:** `multipart/form-data` with field `image` (image file)

**Response:**
```json
{
  "success": true,
  "top": {
    "rank": 1,
    "class_id": "adidas_samba_og",
    "label": "Adidas Samba Og",
    "confidence": 87.4
  },
  "predictions": [ ... all classes ranked ... ],
  "thumbnail": "data:image/jpeg;base64,...",
  "image_size": [800, 600]
}
```

---

## Production Build

```bash
cd frontend
npm run build
# Output in frontend/dist/ — deploy to Vercel, Netlify, or serve with nginx
```

For the backend in production, use **gunicorn**:
```bash
pip install gunicorn
gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| CORS error | Make sure Flask is running on port 5000 |
| Model not found | Put `.pth` file inside the `backend/` folder |
| CUDA out of memory | Set `DEVICE = 'cpu'` in app.py |
| Wrong predictions | You need more training images per class |
