// AI Service for scheme recommendations using OpenAI
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

/**
 * Get AI-powered scheme recommendations
 * @param {Object} userProfile - User profile data
 * @param {Object} projectData - Project details
 * @param {Array} availableSchemes - Available schemes from database
 * @returns {Promise<Object>} AI recommendation
 */
export async function getAISchemeRecommendation(userProfile, projectData, availableSchemes) {
  if (!API_KEY) {
    throw new Error("OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to .env");
  }

  const schemesText = availableSchemes
    .map(
      (scheme) =>
        `- ${scheme.name}: ${scheme.description} (Max Loan: ₹${scheme.maximumLoanAmount}, Interest: ${scheme.interestRate}%)`
    )
    .join("\n");

  const userProfileText = `
Age: ${userProfile.age}
Annual Income: ₹${userProfile.income}
Category: ${userProfile.category}
Education: ${userProfile.education}
State: ${userProfile.state}
Occupation: ${userProfile.occupation}
  `.trim();

  const projectText = `
Project Type: ${projectData.projectType}
Estimated Cost: ₹${projectData.projectCost}
Required Loan: ₹${projectData.requiredLoan}
Purpose: ${projectData.purpose}
  `.trim();

  const prompt = `You are an expert government scheme advisor for Indian entrepreneurs.

Available Government Schemes:
${schemesText}

User Profile:
${userProfileText}

Project Details:
${projectText}

Based on the user's profile and project details, recommend the SINGLE most suitable scheme from the list above. Provide:
1. Scheme name
2. Why it's the best match (3 key reasons)
3. Eligibility match score (0-100)
4. Next steps to apply

Format your response as JSON with keys: schemeName, reasons (array), eligibilityScore, nextSteps (array).`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful government scheme advisor. Always respond with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to get AI recommendation");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No recommendation received from AI");
    }

    // Parse JSON from response
    let recommendation;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      recommendation = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      // If parsing fails, return structured response
      recommendation = {
        schemeName: "Unable to parse recommendation",
        reasons: [content],
        eligibilityScore: 0,
        nextSteps: ["Please try again"],
      };
    }

    return {
      type: "ai",
      schemeName: recommendation.schemeName,
      reasons: recommendation.reasons || [],
      eligibilityScore: recommendation.eligibilityScore || 0,
      nextSteps: recommendation.nextSteps || [],
      aiGenerated: true,
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}

/**
 * Get AI analysis of eligibility for a specific scheme
 * @param {Object} userProfile - User profile data
 * @param {Object} scheme - Scheme details
 * @returns {Promise<Object>} Eligibility analysis
 */
export async function getEligibilityAnalysis(userProfile, scheme) {
  if (!API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  const prompt = `Analyze if a user meets the eligibility criteria for a government scheme.

Scheme: ${scheme.name}
Criteria: ${scheme.criteria || "Not specified"}
Requirements: ${scheme.requirements || "Not specified"}

User Profile:
Age: ${userProfile.age}
Income: ₹${userProfile.income}
Category: ${userProfile.category}
Education: ${userProfile.education}

Provide eligibility analysis in JSON format with keys: isEligible (boolean), matchPercentage (0-100), gaps (array), recommendations (array).`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get eligibility analysis");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch (error) {
    console.error("Eligibility Analysis Error:", error);
    throw error;
  }
}
