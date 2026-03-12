import { Link } from "react-router-dom";
import "./Cancel.css";
export default function Cancel() {
  return (
    <div className="cancel-page">
      <div className="cancel-card">
        <div className="cancel-card__icon">✕</div>
        <h1 className="cancel-card__title">Payment Cancelled</h1>
        <p className="cancel-card__message">Your payment was not completed. No charges have been made.</p>
        <Link to="/" className="cancel-card__cta">Return to Store</Link>
      </div>
    </div>
  );
}