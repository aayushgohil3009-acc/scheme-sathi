function SchemeDetails({ scheme, onBack }) {
  if (!scheme) {
    return (
      <div>
        <p>No scheme selected.</p>
        <button className="primary-button" onClick={onBack}>← Back to Dashboard</button>
      </div>
    );
  }

  const schemeName = scheme.name || scheme.title || "Scheme";
  const loanText = scheme.loan || `₹${Number(scheme.maximumLoanAmount || 0).toLocaleString("en-IN")}`;
  const interestText = scheme.interest || `${scheme.interestRate || 0}%`;
  const tenureText = scheme.tenure || `${scheme.tenureYears || 0} Years`;

  return (
    <div className="details-page">
      <button className="back-button" onClick={onBack}>← Back</button>

      <div className="details-header">
        <div className="scheme-icon large">₹</div>
        <div>
          <h1>{schemeName}</h1>
          <p>{scheme.description || "No description available."}</p>
        </div>
      </div>

      <div className="details-stats">
        <div>
          <span>Maximum Loan</span>
          <strong>{loanText}</strong>
        </div>
        <div>
          <span>Interest Rate</span>
          <strong>{interestText}</strong>
        </div>
        <div>
          <span>Tenure</span>
          <strong>{tenureText}</strong>
        </div>
      </div>

      <div className="details-section">
        <h2>Eligibility Criteria</h2>
        <ul>
          <li>Annual family income between ₹{scheme.minIncome || 0} and ₹{scheme.maxIncome || "N/A"}</li>
          <li>Age between {scheme.minAge || 18} and {scheme.maxAge || 45} years</li>
          <li>Must belong to an eligible category: {(scheme.eligibleCategories || []).join(", ") || "As specified"}</li>
          <li>Project type should align with: {(scheme.projectTypes || []).join(", ") || "Applicable business needs"}</li>
        </ul>
      </div>

      <div className="details-section">
        <h2>Documents Required</h2>
        <ul>
          {(scheme.requiredDocuments || ["Aadhaar Card", "Income Certificate", "Project Proposal / Business Plan"]).map((documentName) => (
            <li key={documentName}>{documentName}</li>
          ))}
        </ul>
      </div>

      <button className="primary-button full">Apply for this Scheme</button>
    </div>
  );
}

export default SchemeDetails;