function SchemeCard({
  title,
  description,
  loan,
  interest,
  tenure,
  recommended,
  onViewDetails
}) {

  return (
    <div className="scheme-card">

      {recommended && (
        <span className="recommended">
          ✦ AI Recommended
        </span>
      )}

      <div className="scheme-header">
        <div className="scheme-icon">₹</div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="scheme-details">
        <div>
          <span>Maximum Loan</span>
          <strong>{loan}</strong>
        </div>
        <div>
          <span>Interest Rate</span>
          <strong>{interest}</strong>
        </div>
        <div>
          <span>Tenure</span>
          <strong>{tenure}</strong>
        </div>
      </div>

      <button
        className="scheme-button"
        onClick={() =>
          onViewDetails({ title, description, loan, interest, tenure })
        }
      >
        View Scheme Details →
      </button>

    </div>
  );
}

export default SchemeCard;