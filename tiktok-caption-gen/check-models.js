const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log("❌ Error: Could not find API Key. Make sure it's in .env.local");
    return;
  }

  console.log("🔑 Testing Key:", apiKey.substring(0, 10) + "...");
  
  try {
    // We will try to fetch the model list manually since the SDK simplifies this
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    console.log("\n✅ SUCCESS! Here are the models your key can access:\n");
    
    // Filter for models that generate content
    const availableModels = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", "")); // Clean up the name

    availableModels.forEach(name => console.log(`👉 "${name}"`));

    console.log("\nCopy one of the names above into your route.js file!");

  } catch (error) {
    console.error("❌ Failed to connect:", error.message);
  }
}

checkModels();