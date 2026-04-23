import { useRef, useState } from "react";
import "./Uploader.css";

export default function Uploader({ onImage, loading, preview, error }) {
  const inputRef  = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    onImage(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="uploader-wrap">
      <div
        className={`drop-zone ${drag ? "drag-over" : ""} ${loading ? "loading" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => !loading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {loading ? (
          <div className="loading-state">
            {preview && (
              <div className="preview-thumb">
                <img src={preview} alt="preview" />
                <div className="scan-line" />
              </div>
            )}
            <div className="spinner-ring" />
            <p className="loading-label">Classifying shoe model...</p>
            <p className="loading-sub">Running CLIP inference</p>
          </div>
        ) : (
          <div className="idle-state">
            <div className="upload-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 8L20 28M20 8L14 14M20 8L26 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 32H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="drop-title">Drop a shoe image</h2>
            <p className="drop-sub">or click to browse · JPG, PNG, WEBP</p>
            {error && <p className="error-msg">⚠ {error}</p>}
          </div>
        )}
      </div>

      <div className="sample-hint">
        <span>💡 Tip:</span> Use clear, well-lit photos for best accuracy
      </div>
    </div>
  );
}
