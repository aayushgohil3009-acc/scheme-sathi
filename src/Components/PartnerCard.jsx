function PartnerCard({
  name,
  type,
  location,
  distance,
  status
}) {

  return (
    <div className="partner-card">

      <div className="partner-icon">
        🏦
      </div>

      <div className="partner-info">

        <h3>{name}</h3>

        <p>{type}</p>

        <span>
          📍 {location}
        </span>

      </div>

      <div className="partner-right">

        <strong>
          {distance}
        </strong>

        <span className="partner-status">
          {status}
        </span>

        <button>
          Get Directions
        </button>

      </div>

    </div>
  );
}

export default PartnerCard;