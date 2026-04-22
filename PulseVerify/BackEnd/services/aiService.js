import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export const verifySportsMedia = async (imageUrl) => {
  try {
    const response = await hf.chatCompletion({
      model: "google/gemma-4-E4B-it", // The user-friendly edge model
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Is this image an official sports broadcast? Look for team logos, stadium graphics, or official player jerseys. Respond with a JSON object: { 'isOfficial': boolean, 'confidence': 0-100, 'reasoning': string }" },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 500,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI Verification Failed:", error);
    return { isOfficial: false, confidence: 0, reasoning: "AI Error" };
  }
};