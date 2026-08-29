import { useEffect, useMemo, useState } from "react";
import PartnerCard from "../Components/PartnerCard";
import { getChannelPartners, sortPartnersByDistance } from "../firebase/partnerService";
import { getUserProfile } from "../firebase/userService";

function Partners({ user }) {
  const [partners, setPartners] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPartners = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const [userProfile, allPartners] = await Promise.all([
          getUserProfile(user.uid),
          getChannelPartners(),
        ]);

        setProfile(userProfile || {});
        setPartners(allPartners || []);
      } catch (err) {
        setError(err.message || "Unable to load nearby partners.");
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, [user]);

  const nearestPartners = useMemo(() => {
    const userLatitude = Number(profile?.latitude || 28.6139);
    const userLongitude = Number(profile?.longitude || 77.2090);
    return sortPartnersByDistance(partners, userLatitude, userLongitude);
  }, [partners, profile]);

  if (loading) {
    return <div className="empty-result"><h2>Loading partners...</h2></div>;
  }

  if (error) {
    return <div className="empty-result"><h2>Unable to load partners</h2><p>{error}</p></div>;
  }

  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">CHANNEL FINANCE NETWORK</p>
        <h1>Find a Channel Partner</h1>
        <p>Locate authorized agencies and financial institutions near you.</p>
      </div>

      <div className="location-bar">
        <div>
          📍 <strong>{profile?.city || "Your city"}</strong>
          <span> · Searching within 25 km</span>
        </div>
        <button>Change Location</button>
      </div>

      <div className="partner-list">
        {nearestPartners.length ? (
          nearestPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              name={partner.name}
              type={partner.type}
              location={`${partner.city || ""}, ${partner.state || ""}`.trim() || partner.address}
              distance={`${partner.distanceKm?.toFixed(1) || "0.0"} km`}
              status={partner.active ? "Eligible" : "Unavailable"}
            />
          ))
        ) : (
          <div className="empty-result"><h2>No partners found</h2><p>There are no active partners near your current selection.</p></div>
        )}
      </div>
    </div>
  );
}

export default Partners;