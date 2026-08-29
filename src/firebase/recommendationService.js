import { getFriendlyErrorMessage } from "./firestore";

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toLowerArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map((value) => String(value).toLowerCase());
}

export function generateSchemeRecommendations(userProfile = {}, projectDetails = {}, schemes = []) {
  const profileAge = safeNumber(userProfile.age, 0);
  const profileIncome = safeNumber(userProfile.income, 0);
  const profileCategory = String(userProfile.category || "").toLowerCase();
  const profileEducation = String(userProfile.education || "").toLowerCase();
  const profileState = String(userProfile.state || "").toLowerCase();
  const profileOccupation = String(userProfile.occupation || "").toLowerCase();

  const projectType = String(projectDetails.projectType || "").toLowerCase();
  const projectCost = safeNumber(projectDetails.projectCost, 0);
  const requiredLoan = safeNumber(projectDetails.requiredLoan, 0);
  const purpose = String(projectDetails.purpose || "").toLowerCase();

  return schemes
    .map((scheme) => {
      const eligibleCategories = toLowerArray(scheme.eligibleCategories);
      const eligibleStates = toLowerArray(scheme.eligibleStates);
      const projectTypes = toLowerArray(scheme.projectTypes);
      const maxLoanAmount = safeNumber(scheme.maximumLoanAmount, 0);
      const minLoanAmount = safeNumber(scheme.minimumLoanAmount, 0);
      const minIncome = safeNumber(scheme.minIncome, 0);
      const maxIncome = safeNumber(scheme.maxIncome, 0);
      const minAge = safeNumber(scheme.minAge, 0);
      const maxAge = safeNumber(scheme.maxAge, 0);
      const loanAmount = requiredLoan || projectCost;

      let score = 0;
      const reasons = [];

      if (profileIncome > 0 && minIncome > 0 && maxIncome > 0) {
        if (profileIncome <= maxIncome) {
          score += 25;
          reasons.push("Income fits the scheme limits.");
        } else {
          reasons.push("Income is above the preferred threshold.");
        }
      }

      if (profileCategory && eligibleCategories.length > 0) {
        if (eligibleCategories.includes(profileCategory)) {
          score += 20;
          reasons.push("Category matches the target beneficiaries.");
        } else {
          reasons.push("Category may not match all target groups.");
        }
      }

      if (projectType && projectTypes.length > 0) {
        if (projectTypes.includes(projectType)) {
          score += 20;
          reasons.push("Project type aligns with scheme support.");
        } else {
          reasons.push("Project type is only partially aligned.");
        }
      }

      if (profileState && eligibleStates.length > 0) {
        if (eligibleStates.includes(profileState)) {
          score += 10;
          reasons.push("State is eligible under the scheme.");
        } else {
          reasons.push("State eligibility may be limited.");
        }
      }

      if (profileAge > 0 && minAge > 0 && maxAge > 0) {
        if (profileAge >= minAge && profileAge <= maxAge) {
          score += 10;
          reasons.push("Age falls within the scheme range.");
        } else {
          reasons.push("Age may fall outside the eligibility window.");
        }
      }

      const educationMatches = [profileEducation, profileOccupation].some((value) => {
        const combined = `${value} ${String(scheme.targetBeneficiaries || "")}`.toLowerCase();
        return combined.includes(value) || (value && (String(scheme.description || "").toLowerCase().includes(value)));
      });

      if (profileEducation || profileOccupation) {
        if (educationMatches) {
          score += 10;
          reasons.push("Education or occupation aligns with the beneficiary profile.");
        } else {
          reasons.push("Profile fit is moderate for this scheme.");
        }
      }

      if (loanAmount > 0 && maxLoanAmount > 0) {
        if (loanAmount <= maxLoanAmount && loanAmount >= minLoanAmount) {
          score += 5;
          reasons.push("Requested loan amount is compatible with the scheme ceiling.");
        } else {
          reasons.push("Loan size may need adjustment for this scheme.");
        }
      }

      if (purpose && String(scheme.description || "").toLowerCase().includes(purpose)) {
        score += 5;
        reasons.push("Purpose matches the scheme objectives.");
      }

      return {
        ...scheme,
        score,
        reasons: reasons.length ? reasons : ["Basic profile and project details are acceptable."],
      };
    })
    .filter((scheme) => scheme.score > 0 || scheme.active)
    .sort((a, b) => b.score - a.score);
}

export async function getRecommendationSummary(userProfile, projectDetails, schemes) {
  try {
    return generateSchemeRecommendations(userProfile, projectDetails, schemes);
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, "Unable to generate recommendations."));
  }
}
