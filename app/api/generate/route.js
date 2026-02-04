import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  // 1. Security Check: Is API Key present?
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API Key is missing in .env.local" }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const formData = await req.formData();
    
    const topic = formData.get("topic");
    const mood = formData.get("mood");
    const file = formData.get("image");

    console.log("--- Request Received ---");
    console.log("Mood:", mood);
    console.log("Has Image:", file ? "Yes" : "No");

    // 2. Build the Prompt
    let prompt = `Act as a TikTok expert. Write 3 viral captions with 5 hashtags. Mood: ${mood}.`;
    let parts = []; // Array to hold text + image data

    if (file && file instanceof Blob) {
      // --- Image Mode ---
      console.log("Processing Image...");
      const buffer = Buffer.from(await file.arrayBuffer());
      
      const imagePart = {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      };
      
      parts.push(imagePart);
      prompt += " Analyze the visual details of this image to write the captions.";
      
      // If user added text context along with the photo
      if (topic && topic.trim() !== "") {
        prompt += ` ADDITIONAL CONTEXT provided by user: "${topic}". Use this context combined with the visual analysis.`;
      }
    } else {
      // --- Text Only Mode ---
      prompt += ` The video is about: "${topic}".`;
    }

    // Add the final prompt instructions
    parts.push(prompt);

    // 3. Call AI Model (Gemini 1.5 Flash)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    console.log("Success! Generated Text Length:", text.length);
    return NextResponse.json({ result: text });

  } catch (error) {
    console.error("API Error Details:", error);
    return NextResponse.json({ 
      error: "Failed to generate. Check server terminal for details.", 
      details: error.message 
    }, { status: 500 });
  }
}