import { useState } from "react";
import "./ResultPanel.css";

export default function ResultPanel({ result, onReset }) {
  const [showAll, setShowAll] = useState(false);
  const { top, predictions, thumbnail, image_size } = result;

  const visible = showAll ? predictions : predictions.slice(0, 5);
  const maxConf = predictions[0].confidence;

  const confColor = (conf) => {
    if (conf >= 70) return "var(--accent)";
    if (conf >= 40) return "#f0a030";
    return "var(--muted)";
  };

  return (
    <div className="result-wrap">
      {/* ── Top card ── */}
      <div className="top-card">
        <div className="top-image-wrap">
          <img src={thumbnail} alt="classified shoe" className="top-image" />
          <div className="img-corner tl" />
          <div className="img-corner tr" />
          <div className="img-corner bl" />
          <div className="img-corner br" />
        </div>

        <div className="top-info">
          <p className="top-rank">TOP MATCH</p>
          <h1 className="top-label">{top.label}</h1>

          <div className="conf-badge" style={{ "--c": confColor(top.confidence) }}>
            <span className="conf-value">{top.confidence.toFixed(1)}%</span>
            <span className="conf-word">confidence</span>
          </div>

          <div className="meta-row">
            <span className="meta-chip">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {image_size[0]} × {image_size[1]}px
            </span>
            <span className="meta-chip">CLIP ViT-B/32</span>
          </div>

          <button className="reset-btn" onClick={onReset}>
            ← Classify another
          </button>
        </div>
      </div>

      {/* ── Probability bars ── */}
      <div className="bars-section">
        <h3 className="bars-title">Full probability distribution</h3>

        <div className="bars-list">
          {visible.map((pred, i) => (
            <div
              key={pred.class_id}
              className={`bar-row ${i === 0 ? "bar-row--top" : ""}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="bar-meta">
                <span className="bar-rank">#{pred.rank}</span>
                <span className="bar-label">{pred.label}</span>
                <span className="bar-conf" style={{ color: confColor(pred.confidence) }}>
                  {pred.confidence.toFixed(1)}%
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(pred.confidence / maxConf) * 100}%`,
                    background: i === 0
                      ? "var(--accent)"
                      : `rgba(232,240,74,${0.15 + (pred.confidence / maxConf) * 0.25})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {predictions.length > 5 && (
          <button className="show-all-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less ↑" : `Show all ${predictions.length} classes ↓`}
          </button>
        )}
      </div>
    </div>
  );
}
