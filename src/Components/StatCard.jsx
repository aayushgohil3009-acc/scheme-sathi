function StatCard({
  title,
  value,
  subtitle,
  icon
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <span className="stat-subtitle">
        {subtitle}
      </span>

    </div>
  );
}

export default StatCard;