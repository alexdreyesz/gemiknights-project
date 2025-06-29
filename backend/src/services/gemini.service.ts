import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface EmergencySummary {
  summary: string;
  urgency: string;
  keyPoints: string[];
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" });

  async generateEmergencySummary(
    userName: string,
    healthConditions: string[],
    allergies: string[],
    emergencyType: string = "Medical Emergency"
  ): Promise<EmergencySummary> {
    try {
      const prompt = `You are an emergency medical AI assistant. Create a conversational, audio-style summary for emergency responders about a patient in distress.

Patient Name: ${userName}
Patient Health Conditions: ${
        healthConditions.length > 0
          ? healthConditions.join(", ")
          : "None listed"
      }
Patient Allergies: ${
        allergies.length > 0 ? allergies.join(", ") : "None listed"
      }
Emergency Type: ${emergencyType}

Please provide a natural, spoken-style summary that sounds like you're talking to emergency responders. Focus on:

1. A conversational summary of what might be happening based on their health conditions
2. The urgency level (high, medium, low)
3. 2-3 key points emergency responders should know

Format your response as:
SUMMARY: [A natural, conversational summary like "Based on John's medical history, he may be experiencing complications related to his diabetes. Given his condition, this could be a diabetic emergency requiring immediate attention."]

URGENCY: [high/medium/low]

KEY POINTS:
- [First key point]
- [Second key point]
- [Third key point]

Make it sound natural and conversational, like you're speaking to emergency responders over the radio.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response into structured data
      return this.parseEmergencySummary(text);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Return fallback summary if Gemini fails
      return this.getFallbackSummary(userName, healthConditions, allergies);
    }
  }

  private parseEmergencySummary(response: string): EmergencySummary {
    try {
      const lines = response.split("\n").filter((line) => line.trim());

      let summary = "";
      let urgency = "medium";
      const keyPoints: string[] = [];

      let currentSection = "";

      lines.forEach((line) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("SUMMARY:")) {
          currentSection = "summary";
          summary = trimmedLine.replace("SUMMARY:", "").trim();
        } else if (trimmedLine.startsWith("URGENCY:")) {
          currentSection = "urgency";
          urgency = trimmedLine.replace("URGENCY:", "").trim().toLowerCase();
        } else if (trimmedLine.startsWith("KEY POINTS:")) {
          currentSection = "keyPoints";
        } else if (
          trimmedLine.startsWith("-") &&
          currentSection === "keyPoints"
        ) {
          keyPoints.push(trimmedLine.replace("-", "").trim());
        } else if (currentSection === "summary" && summary) {
          summary += " " + trimmedLine;
        }
      });

      return {
        summary: summary || "Patient requires immediate medical attention.",
        urgency: urgency,
        keyPoints:
          keyPoints.length > 0
            ? keyPoints
            : [
                "Patient needs immediate assessment",
                "Consider medical history in treatment",
              ],
      };
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return this.getFallbackSummary("Patient", [], []);
    }
  }

  private getFallbackSummary(
    userName: string,
    healthConditions: string[],
    allergies: string[]
  ): EmergencySummary {
    const hasConditions = healthConditions.length > 0;
    const hasAllergies = allergies.length > 0;

    let summary = `Based on ${userName}'s medical information`;

    if (hasConditions && hasAllergies) {
      summary += `, they have documented health conditions and allergies that may be relevant to this emergency.`;
    } else if (hasConditions) {
      summary += `, they have documented health conditions that may be contributing to this emergency.`;
    } else if (hasAllergies) {
      summary += `, they have documented allergies that emergency responders should be aware of.`;
    } else {
      summary += `, this appears to be a general medical emergency requiring immediate attention.`;
    }

    return {
      summary,
      urgency: "high",
      keyPoints: [
        "Patient requires immediate medical assessment",
        hasConditions
          ? "Consider documented health conditions in treatment plan"
          : "Standard emergency protocols apply",
        hasAllergies
          ? "Be aware of documented allergies"
          : "No known allergies reported",
      ],
    };
  }
}

export default new GeminiService();
