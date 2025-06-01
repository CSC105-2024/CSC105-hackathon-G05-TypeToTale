import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NewBookComponent() {
  const [storyInput, setStoryInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [imageProfile, setImageProfile] = useState("");

  useEffect(() => {
    setImageProfile(JSON.parse(localStorage.getItem("user")).img_url);
  }, []);

  const handleStartStory = async () => {
    if (!storyInput.trim()) return;
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const response = await axiosInstance.post(
        `secure/generate-story/${userId}`,
        { theme: storyInput.trim() },
      );
      console.log("Story created:", response.data);
      navigate("/bookshelf");
    } catch (error) {
      console.error("Error creating story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>

      <motion.button
        onClick={() => navigate("/edit-account")}
        className="absolute top-6 right-6 z-10 group"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#5C5E81] cursor-pointer shadow-lg bg-gradient-to-br from-[#5C5E81] to-[#838FAF] text-white font-bold flex items-center justify-center">
          <img
            src={imageProfile}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.button>

      <div className="flex flex-col flex-grow px-5 pb-8 md:px-8">
        <motion.div
          className="relative pt-6"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#5C5E81] tracking-wide mb-2">
            TypeToTale
          </h1>
          <p className="text-sm md:text-lg text-[#8C8DA3] tracking-wide">
            Start typing to begin telling a story together!
          </p>
        </motion.div>

        <motion.div
          className="items-center text-lg mt-12 font-bold md:mt-8 ml-10 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            onClick={() => navigate("/bookshelf")}
            className="text-[23px] font-bold text-[#8C8DA3] hover:text-[#5C5E81]"
          >
            Bookshelf
          </button>
          <span className="mx-2 text-[#5C5E81]">{">"}</span>
          <span className="text-[23px] text-[#5C5E81]">create a story</span>
        </motion.div>

        <div className="flex flex-1 justify-center items-center px-2">
          <motion.div
            className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl w-full max-w-2xl p-8 md:p-12 border border-white/20 relative"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#5C5E81] via-[#838FAF] to-[#5C5E81] p-[2px]">
              <div className="bg-white rounded-3xl w-full h-full"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#5C5E81] mb-4 leading-tight">
                  Let's Start Your Story!
                </h2>
                <p className="text-lg text-[#8C8DA3] leading-relaxed">
                  Enter a theme word and watch your imagination come to life
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={storyInput}
                    onChange={(e) => setStoryInput(e.target.value)}
                    placeholder="Adventure, Princess, Magic, Science..."
                    className="w-full py-4 px-6 rounded-2xl text-lg text-[#5C5E81] bg-gray-50 placeholder-[#9D9191] border-2 border-transparent focus:border-[#838FAF] focus:outline-none focus:bg-white transition-all duration-300"
                    onKeyDown={(e) => e.key === "Enter" && handleStartStory()}
                    disabled={isLoading}
                  />
                </div>
                <div className="text-right">
                  <span className="text-sm text-[#8C8DA3]">
                    {storyInput.length > 0 && `${storyInput.length} characters`}
                  </span>
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <motion.button
                  onClick={handleStartStory}
                  disabled={!storyInput.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#5C5E81] to-[#838FAF] text-white px-12 py-4 rounded-full text-lg font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#5C5E81]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating Story...
                    </span>
                  ) : (
                    "START YOUR ADVENTURE"
                  )}
                </motion.button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-[#8C8DA3] leading-relaxed">
                  💡 <strong>Pro tip:</strong> Try words like "mystery",
                  "friendship", or "dragons" for exciting stories!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
