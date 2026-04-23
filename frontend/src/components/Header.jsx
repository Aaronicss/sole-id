import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">👟</span>
          <span className="logo-text">SoleID</span>
        </div>
        <div className="header-tag">
          <span className="tag-dot" />
          Fine-Tuned CLIP
        </div>
      </div>
    </header>
  );
}
