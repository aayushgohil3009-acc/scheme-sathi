function Profile() {

  return (
    <div>

      <div className="page-heading">

        <p className="eyebrow">
          MY PROFILE
        </p>

        <h1>
          Applicant Profile
        </h1>

        <p>
          Your information helps Scheme Sathi find
          relevant financial schemes.
        </p>

      </div>


      <div className="profile-card">

        <div className="profile-avatar">
          A
        </div>

        <div>

          <h2>
            Aayush
          </h2>

          <p>
            Entrepreneur
          </p>

        </div>

      </div>


      <div className="profile-grid">

        <div className="profile-field">
          <span>Annual Family Income</span>
          <strong>₹3,50,000</strong>
        </div>

        <div className="profile-field">
          <span>Location</span>
          <strong>New Delhi</strong>
        </div>

        <div className="profile-field">
          <span>Applicant Category</span>
          <strong>SC</strong>
        </div>

        <div className="profile-field">
          <span>Preferred Language</span>
          <strong>English</strong>
        </div>

      </div>

    </div>
  );
}

export default Profile;