export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: February 04, 2026</p>
        
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Viral Captions ("we," "our," or "us"). We are committed to protecting your privacy. 
          This Privacy Policy explains how we handle your information when you use our AI caption generation tool.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">2. Information We Collect</h2>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Input Data:</strong> We process the text and images you upload solely to generate captions. This data is processed by Google's Gemini AI API.</li>
          <li><strong>Cookies:</strong> We use cookies to store your consent preferences and to display personalized advertisements via Google AdSense.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">3. Third-Party Services</h2>
        <p className="mb-4">
          We use <strong>Google AdSense</strong> to serve ads. Google uses cookies to serve ads based on your prior visits to our website or other websites. 
          You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-400 hover:underline">Google Ad Settings</a>.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6 mb-2">4. Contact Us</h2>
        <p>If you have questions about this policy, please contact us.</p>
      </div>
    </div>
  );
}