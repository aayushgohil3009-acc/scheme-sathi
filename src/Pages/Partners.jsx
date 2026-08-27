import PartnerCard from "../components/PartnerCard";

function Partners() {

  return (
    <div>

      <div className="page-heading">

        <p className="eyebrow">
          CHANNEL FINANCE NETWORK
        </p>

        <h1>
          Find a Channel Partner
        </h1>

        <p>
          Locate authorized agencies and financial
          institutions near you.
        </p>

      </div>


      <div className="location-bar">

        <div>
          📍 <strong>New Delhi</strong>
          <span> · Searching within 25 km</span>
        </div>

        <button>
          Change Location
        </button>

      </div>


      <div className="partner-list">

        <PartnerCard
          name="State Channelizing Agency"
          type="SCA"
          location="Connaught Place, New Delhi"
          distance="3.2 km"
          status="Eligible"
        />

        <PartnerCard
          name="Regional Rural Bank"
          type="RRB"
          location="Karol Bagh, New Delhi"
          distance="5.8 km"
          status="Eligible"
        />

        <PartnerCard
          name="Public Sector Bank"
          type="PSB"
          location="Lajpat Nagar, New Delhi"
          distance="8.4 km"
          status="Eligible"
        />

      </div>

    </div>
  );
}

export default Partners;