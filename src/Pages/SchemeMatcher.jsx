import { useEffect, useState } from "react";
import { getAllSchemes } from "../firebase/schemeService";
import { getUserProfile } from "../firebase/userService";
import { getAISchemeRecommendation } from "../firebase/aiService";
import demoSchemes from "../data/schemes";
import { ScanSearch } from "lucide-react";

// Prototype matcher: ranks each catalogue entry by both category eligibility and loan fit.
export function findDemoSchemeMatch(catalogue, userProfile, projectData) {
  const requestedAmount = Number(projectData.requiredLoan || projectData.projectCost || 0);
  const category = String(userProfile.category || "General").toLowerCase();

  return catalogue
    .map((scheme) => {
      const categories = (scheme.eligibleCategories || []).map((item) => item.toLowerCase());
      const categoryMatch = categories.includes(category);
      const costMatch = requestedAmount >= Number(scheme.minimumLoanAmount || 0) && requestedAmount <= Number(scheme.maximumLoanAmount || 0);
      const score = (categoryMatch ? 55 : 10) + (costMatch ? 35 : 0) + (scheme.recommended ? 10 : 0);
      return {
        ...scheme,
        score,
        eligibilityScore: score,
        reasons: [
          categoryMatch ? `${userProfile.category || "Your"} category is supported by this scheme.` : "This scheme is open to a related entrepreneur group.",
          costMatch ? "Your requested loan fits this scheme's funding range." : "Your project may need a revised loan amount for this scheme.",
          `Supports ${projectData.projectType || "business"} enterprises.`,
        ],
      };
    })
    .sort((first, second) => second.score - first.score)[0] || null;
}

function SchemeMatcher({ user }) {
  const [form, setForm] = useState({ projectType: "", projectCost: "", requiredLoan: "", income: "", education: "", purpose: "" });
  const [profile, setProfile] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [aiError, setAiError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return setLoading(false);
      try {
        const [userProfile, allSchemes] = await Promise.all([getUserProfile(user.uid).catch(() => null), getAllSchemes().catch(() => [])]);
        setProfile(userProfile || {});
        setSchemes(allSchemes.length ? allSchemes : demoSchemes);
        if (userProfile) setForm((current) => ({ ...current, income: userProfile.annualIncome || "", education: userProfile.education || "" }));
      } catch { setError("Unable to load data. Please refresh the page."); } finally { setLoading(false); }
    };
    loadData();
  }, [user]);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const findScheme = async () => {
    const cost = Number(form.projectCost || 0);
    const loan = Number(form.requiredLoan || form.projectCost || 0);
    if (!form.projectType || !cost || !form.income) return setFormError("Add your project type, estimated cost, and annual income to start matching.");
    setFormError(""); setAiError(""); setResult(null); setAiLoading(true);
    const scanStartedAt = Date.now();
    const userProfile = { age: profile?.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 30, income: Number(form.income), category: profile?.category || "General", education: form.education || profile?.education || "", state: profile?.state || "", occupation: profile?.occupation || "" };
    const projectData = { projectType: form.projectType, projectCost: cost, requiredLoan: loan, purpose: form.purpose || "business" };
    try {
      const catalogue = schemes.length ? schemes : demoSchemes;
      const recommendation = useAI ? await getAISchemeRecommendation(userProfile, projectData, catalogue) : findDemoSchemeMatch(catalogue, userProfile, projectData);
      const delay = 950 - (Date.now() - scanStartedAt);
      if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
      setResult(recommendation);
    } catch (err) {
      setAiError(err.message || "AI matching is unavailable, so we used eligibility rules instead.");
      setResult(findDemoSchemeMatch(schemes.length ? schemes : demoSchemes, userProfile, projectData));
    } finally { setAiLoading(false); }
  };

  if (loading) return <div className="empty-result page-skeleton"><div className="skeleton-orb" /><h2>Preparing your matcher...</h2></div>;
  if (error) return <div className="empty-result"><div className="ai-circle">!</div><h2>Unable to load recommendations</h2><p>{error}</p><button className="primary-button" onClick={() => window.location.reload()}>Refresh page</button></div>;
  const confidence = Math.min(Number(result?.eligibilityScore || result?.score || 0), 100);

  return <div className="matcher-page">
    <div className="page-heading animate-in"><p className="eyebrow">AI SCHEME MATCHER</p><h1>Find the right scheme</h1><p>Tell us about your project and we’ll identify suitable government financing options.</p></div>
    <div className="matcher-container">
      <div className="matcher-form animate-in"><h2>Tell us about your requirements</h2>
        <div className="form-group"><label>Project Type</label><select name="projectType" value={form.projectType} onChange={handleChange}><option value="">Select project type</option><option value="Dairy">Dairy</option><option value="Retail">Retail</option><option value="Textiles">Textiles</option><option value="Manufacturing">Manufacturing</option><option value="Services">Services</option></select></div>
        <div className="form-group"><label>Estimated Project Cost</label><div className="input-prefix"><span>₹</span><input type="number" name="projectCost" placeholder="Example: 500000" value={form.projectCost} onChange={handleChange} /></div></div>
        <div className="form-group"><label>Required Loan Amount</label><div className="input-prefix"><span>₹</span><input type="number" name="requiredLoan" placeholder="Optional loan need" value={form.requiredLoan} onChange={handleChange} /></div></div>
        <div className="form-group"><label>Annual Family Income</label><div className="input-prefix"><span>₹</span><input type="number" name="income" placeholder="Maximum ₹5,00,000" value={form.income} onChange={handleChange} /></div></div>
        <div className="form-group"><label>Education Status</label><select name="education" value={form.education} onChange={handleChange}><option value="">Select status</option><option value="School">School</option><option value="College">College</option><option value="Graduate">Graduate</option><option value="Post Graduate">Post Graduate</option></select></div>
        <div className="form-group"><label>Purpose</label><input type="text" name="purpose" placeholder="e.g. business expansion" value={form.purpose} onChange={handleChange} /></div>
        <div className="form-group ai-toggle"><input type="checkbox" id="useAI" checked={useAI} onChange={(event) => setUseAI(event.target.checked)} /><label htmlFor="useAI">Use AI for smarter recommendations</label></div>
        <button className="primary-button full" onClick={findScheme} disabled={aiLoading}>{aiLoading ? "Analysing your profile..." : <><ScanSearch size={16} /> Find matching schemes</>}</button>
        {formError && <p className="inline-feedback error">{formError}</p>}{aiError && <p className="inline-feedback error">{aiError}</p>}
      </div>
      <div className="matcher-result animate-in">
        {aiLoading ? <div className="ai-scanning" aria-live="polite"><div className="scanner-orb"><ScanSearch size={27} /></div><div className="scan-line" /><h2>Finding your strongest match</h2><p>Comparing eligibility, funding, and project-fit signals.</p><div className="scan-steps"><span>Profile</span><span>Eligibility</span><span>Funding</span></div></div>
          : !result ? <div className="empty-result"><div className="ai-circle"><ScanSearch size={28} /></div><h2>Your recommendation will appear here</h2><p>Complete the form and our matching engine will identify suitable schemes.</p></div>
          : <div className="result-card animate-result"><span className="recommended">{result.aiGenerated ? "Recommended match" : "Smart recommendation"}</span><h2>{result.schemeName || result.name}</h2><p>{result.description}</p><div className="confidence-block"><div className="confidence-heading"><span>Match confidence</span><strong>{confidence}%</strong></div><div className="confidence-track"><span style={{ width: `${confidence}%` }} /></div></div><div className="result-stats"><div><span>Loan</span><strong>₹{Number(result.maximumLoanAmount || 0).toLocaleString("en-IN")}</strong></div><div><span>Interest</span><strong>{result.interestRate || "—"}%</strong></div><div><span>Score</span><strong>{confidence}/100</strong></div></div>{Array.isArray(result.reasons) && result.reasons.length > 0 && <ul className="recommendation-list">{result.reasons.map((reason, index) => <li key={`${result.id || "result"}-${index}`}>{reason}</li>)}</ul>}{result.nextSteps?.length > 0 && <div className="next-steps"><p>Next steps</p><ul>{result.nextSteps.map((step, index) => <li key={`step-${index}`}>{step}</li>)}</ul></div>}</div>}
      </div>
    </div>
  </div>;
}

export default SchemeMatcher;
