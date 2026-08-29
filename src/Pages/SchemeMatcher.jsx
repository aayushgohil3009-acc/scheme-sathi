import { useEffect, useState } from "react";
import { getAllSchemes, getEligibleSchemes } from "../firebase/schemeService";
import { getUserProfile } from "../firebase/userService";

function SchemeMatcher({ user }) {
  const [form, setForm] = useState({
    projectType: "",
    projectCost: "",
    requiredLoan: "",
    income: "",
    education: "",
    purpose: "",
  });

  const [profile, setProfile] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const [userProfile, allSchemes] = await Promise.all([
          getUserProfile(user.uid),
          getAllSchemes(),
        ]);

        setProfile(userProfile || {});
        setSchemes(allSchemes || []);
        setForm((current) => ({
          ...current,
          income: userProfile?.annualIncome || "",
          education: userProfile?.education || "",
        }));
      } catch (err) {
        setError(err.message || "Unable to load schemes.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const findScheme = () => {
    const cost = Number(form.projectCost || 0);
    const loan = Number(form.requiredLoan || form.projectCost || 0);

    if (!form.projectType || !cost || !form.income) {
      alert("Please complete the required fields.");
      return;
    }

    const userProfile = {
      age: profile?.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 30,
      income: Number(form.income),
      category: profile?.category || "General",
      education: form.education || profile?.education || "",
      state: profile?.state || "",
      occupation: profile?.occupation || "",
    };

    const recommendations = getEligibleSchemes(userProfile, {
      projectType: form.projectType,
      projectCost: cost,
      requiredLoan: loan,
      purpose: form.purpose || "business",
    }, schemes);

    setResult(recommendations[0] || null);
  };

  if (loading) {
    return <div className="empty-result"><h2>Loading scheme matcher...</h2></div>;
  }

  if (error) {
    return <div className="empty-result"><h2>Unable to load recommendations</h2><p>{error}</p></div>;
  }

  return (
    <div className="matcher-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">AI SCHEME MATCHER</p>
          <h1>Find the Right Scheme</h1>
          <p>Tell us about your project and we'll identify suitable government financing options.</p>
        </div>
      </div>

      <div className="matcher-container">
        <div className="matcher-form">
          <h2>Tell us about your requirements</h2>

          <div className="form-group">
            <label>Project Type</label>
            <select name="projectType" value={form.projectType} onChange={handleChange}>
              <option value="">Select project type</option>
              <option value="Dairy">Dairy</option>
              <option value="Retail">Retail</option>
              <option value="Textiles">Textiles</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Services">Services</option>
            </select>
          </div>

          <div className="form-group">
            <label>Estimated Project Cost</label>
            <div className="input-prefix">
              <span>₹</span>
              <input type="number" name="projectCost" placeholder="Example: 500000" value={form.projectCost} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Required Loan Amount</label>
            <div className="input-prefix">
              <span>₹</span>
              <input type="number" name="requiredLoan" placeholder="Optional loan need" value={form.requiredLoan} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Annual Family Income</label>
            <div className="input-prefix">
              <span>₹</span>
              <input type="number" name="income" placeholder="Maximum ₹5,00,000" value={form.income} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Education Status</label>
            <select name="education" value={form.education} onChange={handleChange}>
              <option value="">Select status</option>
              <option value="School">School</option>
              <option value="College">College</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
            </select>
          </div>

          <div className="form-group">
            <label>Purpose</label>
            <input type="text" name="purpose" placeholder="e.g. business expansion" value={form.purpose} onChange={handleChange} />
          </div>

          <button className="primary-button full" onClick={findScheme}>✦ Find Matching Schemes</button>
        </div>

        <div className="matcher-result">
          {!result ? (
            <div className="empty-result">
              <div className="ai-circle">✦</div>
              <h2>Your recommendation will appear here</h2>
              <p>Complete the form and our smart matching engine will identify suitable schemes.</p>
            </div>
          ) : (
            <div className="result-card">
              <span className="recommended">Rule-based recommendation</span>
              <h2>{result.name}</h2>
              <p>{result.description}</p>

              <div className="result-stats">
                <div>
                  <span>Loan</span>
                  <strong>₹{Number(result.maximumLoanAmount || 0).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span>Interest</span>
                  <strong>{result.interestRate || "—"}%</strong>
                </div>
                <div>
                  <span>Score</span>
                  <strong>{result.score || 0}/100</strong>
                </div>
              </div>

              <ul className="recommendation-list">
                {result.reasons?.map((reason, index) => (
                  <li key={`${result.id}-${index}`}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SchemeMatcher;