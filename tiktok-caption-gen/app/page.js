"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";

// --- 1. Background Component ---
const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030014]">
      {/* Tech Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#4a4a4a 1px, transparent 1px), linear-gradient(90deg, #4a4a4a 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      {/* Moving Blobs */}
      <div className="absolute inset-0 flex items-center justify-center filter blur-[100px] opacity-60">
        <motion.div
          animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ x: [0, -100, 100, 0], y: [0, 100, -100, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[400px] h-[400px] bg-pink-600 rounded-full mix-blend-screen"
        />
      </div>
      {/* Shooting Stars */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -100, y: -100, opacity: 0 }}
            animate={{ x: ["0vw", "100vw"], y: ["0vh", "100vh"], opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
            className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
          />
        ))}
      </div>
    </div>
  );
};

// --- 2. Cookie Consent ---
const CookieBanner = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("cookieConsent")) setShow(true);
  }, []);
  const accept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShow(false);
  };
  if (!show) return null;
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-900/90 backdrop-blur border border-gray-700 p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-300">We use cookies to ensure you get the best experience.</p>
        <button onClick={() => setShow(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
      </div>
      <button onClick={accept} className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-lg font-medium transition-colors w-full">Accept & Continue</button>
    </motion.div>
  );
};

// --- 3. Main Application ---
export default function Home() {
  const [inputType, setInputType] = useState("text"); // 'text' or 'image'
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState("Funny");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(""); // Stores error messages

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic size check (5MB limit warning)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image is too large (Max 5MB). Please choose a smaller one.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(""); // Clear error on successful upload
    }
  };

  const generateCaptions = async () => {
    // Validation
    if ((inputType === "text" && !topic) || (inputType === "image" && !imageFile)) {
      setError("Please add a description or upload an image.");
      return;
    }
    
    setLoading(true);
    setCaptions("");
    setError(""); // Clear previous errors

    const formData = new FormData();
    formData.append("mood", mood);
    formData.append("topic", topic); // Send topic even in image mode
    
    if (inputType === "image" && imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      // Handle server errors
      if (!res.ok) {
        if (res.status === 413) throw new Error("Image is too large! Try a smaller photo.");
        const errData = await res.json();
        throw new Error(errData.details || errData.error || "Server Error");
      }

      const data = await res.json();
      setCaptions(data.result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate captions. Check console.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(captions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-purple-500/30">
      <Background />
      <CookieBanner />

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Loader2 size={64} className="text-purple-500" />
            </motion.div>
            <p className="mt-4 text-xl font-medium animate-pulse text-purple-200">Creating Viral Captions...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-12 max-w-3xl relative z-10">
        
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-gray-800/50 rounded-full mb-4 border border-gray-700 backdrop-blur-sm">
            <span className="text-xs font-bold px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full mr-2">V2.1</span>
            <span className="text-xs text-gray-300 pr-2">AI Vision Model Active</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg">
              Viral Captions
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mx-auto">
            Upload a photo or describe your video. Let AI craft the perfect caption to boost your engagement.
          </p>
        </motion.div>

        {/* AdSense Placeholder */}
        <div className="w-full h-24 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl mb-10 flex items-center justify-center text-gray-500 text-sm">
          [ AdSense Banner Area (728x90) ]
        </div>

        {/* Main Interface Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          {/* Tabs */}
          <div className="flex bg-gray-800/50 p-1 rounded-lg mb-6 w-fit mx-auto border border-gray-700/50">
            <button
              onClick={() => { setInputType("text"); setTopic(""); setError(""); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                inputType === "text" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              Text Description
            </button>
            <button
              onClick={() => { setInputType("image"); setError(""); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                inputType === "image" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              Upload Photo
            </button>
          </div>

          <div className="space-y-6">
            
            <AnimatePresence mode="wait">
              {inputType === "text" ? (
                /* TEXT ONLY MODE */
                <motion.div
                  key="text-input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">Explain your video</label>
                  <textarea
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[120px] transition-all text-white placeholder-gray-500"
                    placeholder="e.g. Me trying to debug Java code at 3AM..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </motion.div>
              ) : (
                /* IMAGE UPLOAD MODE */
                <motion.div
                  key="image-input"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload your content</label>
                  <div className="border-2 border-dashed border-gray-600 hover:border-purple-500 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-800/30 hover:bg-gray-800/50 transition-colors relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {imagePreview ? (
                      <div className="relative z-0">
                         <img src={imagePreview} alt="Preview" className="h-48 object-contain rounded-lg shadow-lg" />
                         <p className="text-center text-xs text-gray-400 mt-2">Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 bg-gray-800 rounded-full mb-3 group-hover:bg-gray-700 transition-colors">
                          <ImageIcon size={32} className="text-purple-400" />
                        </div>
                        <p className="text-gray-300 font-medium">Click or Drag Image Here</p>
                        <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG</p>
                      </>
                    )}
                  </div>

                  {/* OPTIONAL CONTEXT BOX (Added) */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                      Add Context (Optional)
                    </label>
                    <textarea
                      className="w-full bg-gray-800/30 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[80px] text-sm text-white placeholder-gray-600"
                      placeholder="e.g. I was at a taylor swift concert feeling happy..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select the Vibe</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Funny", "Aesthetic", "Educational", "Savage"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                      mood === m
                        ? "bg-purple-600/30 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                        : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR MESSAGE DISPLAY (Added) */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* GENERATE BUTTON */}
            <button
              onClick={generateCaptions}
              disabled={loading || (inputType === "text" && !topic) || (inputType === "image" && !imageFile)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/10"
            >
              <Sparkles size={20} className={loading ? "animate-spin" : ""} />
              {loading ? "Generating..." : "Generate Caption"}
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {captions && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 relative shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-400" /> 
                  Your Captions
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy All"}
                </button>
              </div>
              <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-sm md:text-base">
                {captions}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}