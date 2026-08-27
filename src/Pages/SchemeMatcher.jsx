import { useState } from "react";

function SchemeMatcher() {

  const [form, setForm] = useState({
    projectType: "",
    projectCost: "",
    income: "",
    education: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const findScheme = () => {

    const cost = Number(form.projectCost);

    if (!form.projectType || !cost || !form.income) {
      alert("Please complete the required fields.");
      return;
    }

    if (cost <= 140000) {

      setResult({
        name: "Micro Finance Scheme",
        loan: "Up to ₹1.25 Lakh",
        interest: "6.5%",
        tenure: "3 Years",
        reason:
          "Your estimated project cost fits the Micro Finance Scheme."
      });

    } else if (cost <= 5000000) {

      setResult({
        name: "Term Loan Scheme",
        loan: "Up to ₹45 Lakh",
        interest: "8%",
        tenure: "7 Years",
        reason:
          "Your estimated project cost fits the Term Loan Scheme."
      });

    } else {

      setResult({
        name: "No matching scheme",
        loan: "—",
        interest: "—",
        tenure: "—",
        reason:
          "Your project cost is above the current scheme limit."
      });

    }
  };


  return (
    <div className="matcher-page">

      <div className="page-heading">

        <div>
          <p className="eyebrow">
            AI SCHEME MATCHER
          </p>

          <h1>
            Find the Right Scheme
          </h1>

          <p>
            Tell us about your project and we'll
            identify suitable government financing options.
          </p>
        </div>

      </div>


      <div className="matcher-container">

        <div className="matcher-form">

          <h2>
            Tell us about your requirements
          </h2>

          <div className="form-group">

            <label>
              Project Type
            </label>

            <select
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
            >

              <option value="">
                Select project type
              </option>

              <option value="Dairy">
                Dairy
              </option>

              <option value="Retail">
                Retail
              </option>

              <option value="Textiles">
                Textiles
              </option>

              <option value="Manufacturing">
                Manufacturing
              </option>

              <option value="Services">
                Services
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              Estimated Project Cost
            </label>

            <div className="input-prefix">

              <span>₹</span>

              <input
                type="number"
                name="projectCost"
                placeholder="Example: 500000"
                value={form.projectCost}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              Annual Family Income
            </label>

            <div className="input-prefix">

              <span>₹</span>

              <input
                type="number"
                name="income"
                placeholder="Maximum ₹5,00,000"
                value={form.income}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              Education Status
            </label>

            <select
              name="education"
              value={form.education}
              onChange={handleChange}
            >

              <option value="">
                Select status
              </option>

              <option value="School">
                School
              </option>

              <option value="College">
                College
              </option>

              <option value="Graduate">
                Graduate
              </option>

              <option value="Post Graduate">
                Post Graduate
              </option>

            </select>

          </div>


          <button
            className="primary-button full"
            onClick={findScheme}
          >
            ✦ Find Matching Schemes
          </button>

        </div>


        <div className="matcher-result">

          {!result ? (

            <div className="empty-result">

              <div className="ai-circle">
                ✦
              </div>

              <h2>
                Your recommendation will appear here
              </h2>

              <p>
                Complete the form and our smart matching
                engine will identify suitable schemes.
              </p>

            </div>

          ) : (

            <div className="result-card">

              <span className="recommended">
                ✦ BEST MATCH
              </span>

              <h2>
                {result.name}
              </h2>

              <p>
                {result.reason}
              </p>

              <div className="result-stats">

                <div>
                  <span>Loan</span>
                  <strong>{result.loan}</strong>
                </div>

                <div>
                  <span>Interest</span>
                  <strong>{result.interest}</strong>
                </div>

                <div>
                  <span>Tenure</span>
                  <strong>{result.tenure}</strong>
                </div>

              </div>

              <button className="primary-button full">
                View Full Scheme Details
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default SchemeMatcher;