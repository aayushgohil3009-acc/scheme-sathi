function SchemeCard({
  title,
  description,
  loan,
  interest,
  tenure,
  recommended,
  onViewDetails,
  scheme,
}) {
  const schemeData = scheme || {
    title,
    description,
    loan,
    interest,
    tenure,
  };

  return (
    <div className="scheme-card">
      {recommended && <span className="recommended">✦ AI Recommended</span>}

      <div className="scheme-header">
        <div className="scheme-icon">₹</div>
        <div>
          <h3>{schemeData.name || schemeData.title || title}</h3>
          <p>{schemeData.description || description}</p>
        </div>
      </div>

      <div className="scheme-details">
        <div>
          <span>Maximum Loan</span>
          <strong>{schemeData.loan || loan}</strong>
        </div>
        <div>
          <span>Interest Rate</span>
          <strong>{schemeData.interest || interest}</strong>
        </div>
        <div>
          <span>Tenure</span>
          <strong>{schemeData.tenure || tenure}</strong>
        </div>
      </div>

      <button className="scheme-button" onClick={() => onViewDetails?.(schemeData)}>
        View Scheme Details →
      </button>
    </div>
  );
}

export default SchemeCard;