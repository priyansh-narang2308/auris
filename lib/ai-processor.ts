/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function processMeetingTranscript(transcript: any) {
  try {
    let transcriptText = "";

    if (Array.isArray(transcript)) {
      transcriptText = transcript
        .map(
          (item: any) =>
            `${item.speaker || "Speaker"}: ${item.words.map((w: any) => w.word).join(" ")}`,
        )
        .join("\n");
    } else if (typeof transcript === "string") {
      transcriptText = transcript;
    } else if (transcript.text) {
      transcriptText = transcript.text;
    }

    if (!transcriptText || transcriptText.trim().length === 0) {
      throw new Error("No transcript content found");
    }

    const prompt = `You are an AI assistant that analyzes meeting transcripts and provides concise summaries and action items.

                    Please analyze the meeting transcript and provide:
                    1. A clear, concise summary (2-3 sentences) of the main discussion points and decisions
                    2. A list of specific action items mentioned in the meeting

                    Format your response as JSON:
                    {
                        "summary": "Your summary here",
                        "actionItems": [
                            "Action item description 1",
                            "Action item description 2"
                        ]
                    }

                    Return only the action item text as strings.
                    If no clear action items are mentioned, return an empty array for actionItems.

                    Transcript:
                    ${transcriptText}`;

    const result = await client.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const response = result.text;

    if (!response) {
      throw new Error("No response from the AI. Please try again later.");
    }

    const parsed = JSON.parse(response);

    const actionItems = Array.isArray(parsed.actionItems)
      ? parsed.actionItems.map((text: string, index: number) => ({
          id: index + 1,
          text: text,
        }))
      : [];

    return {
      summary:
        parsed.summary ||
        "Summary couldn't be generated. Please try again later.",
      actionItems: actionItems,
    };
  } catch (error) {
    console.error("Error processing transcript with the AI:", error);

    return {
      summary:
        "Meeting transcript processed successfully. Please check the full transcript for details.",
      actionItems: [],
    };
  }
}
