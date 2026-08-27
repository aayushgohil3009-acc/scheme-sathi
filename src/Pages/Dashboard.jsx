import StatCard from "../components/StatCard";
import SchemeCard from "../components/SchemeCard";

function Dashboard({ onViewScheme }) {

  return (
    <div>

      <section className="welcome">

        <div>

      <SchemeCard
        title="Micro Finance Scheme"
        description="For small income-generating businesses."
        loan="₹1.25 Lakh"
        interest="6.5%"
        tenure="3 Years"
        recommended={true}
        onViewDetails={onViewScheme}
      />

      <SchemeCard
        title="Term Loan Scheme"
        description="For larger business projects."
        loan="₹45 Lakh"
        interest="8%"
        tenure="7 Years"
        recommended={false}
        onViewDetails={onViewScheme}
      />

          <p className="eyebrow">
            GOOD MORNING 👋
          </p>

          <h1>
            Welcome back, Aayush
          </h1>

          <p>
            Find the right financial scheme for your
            business or education needs.
          </p>

        </div>

        <button className="primary-button">
          ✦ Find My Scheme
        </button>

      </section>


      <section className="stats-grid">

        <StatCard
          title="Eligible Schemes"
          value="08"
          subtitle="Based on your profile"
          icon="✓"
        />

        <StatCard
          title="Potential Funding"
          value="₹45L"
          subtitle="Maximum eligible amount"
          icon="₹"
        />

        <StatCard
          title="Best Interest Rate"
          value="6.5%"
          subtitle="Concessional rate available"
          icon="%"
        />

        <StatCard
          title="Nearby Partners"
          value="12"
          subtitle="Within 25 km"
          icon="⌖"
        />

      </section>


      <section className="section">

        <div className="section-heading">

          <div>
            <h2>
              AI Recommended Schemes
            </h2>

            <p>
              Based on your income, project type and
              financial requirements.
            </p>
          </div>

          <button className="text-button">
            View All →
          </button>

        </div>


        <div className="scheme-grid">

          <SchemeCard
            title="Micro Finance Scheme"
            description="For small income-generating businesses."
            loan="₹1.25 Lakh"
            interest="6.5%"
            tenure="3 Years"
            recommended={true}
          />

          <SchemeCard
            title="Term Loan Scheme"
            description="For larger business projects."
            loan="₹45 Lakh"
            interest="8%"
            tenure="7 Years"
            recommended={false}
          />

        </div>

      </section>


      <section className="quick-section">

        <div className="quick-card">

          <span>✦</span>

          <div>
            <h3>Not sure which scheme is right?</h3>

            <p>
              Answer a few simple questions and our
              AI will find the best options for you.
            </p>
          </div>

          <button className="primary-button">
            Start Scheme Matcher →
          </button>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;