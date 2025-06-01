import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

export default function CompleteStoryComponent() {
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [profileImage, setProfileImage] = useState("/");

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          `/secure/complete-story/${id}`,
        );
        if (response.data.status) {
          setStoryData(response.data.completedStory.session);
          setProfileImage(JSON.parse(localStorage.getItem("user")).img_url);
        } else {
          setError("Failed to load story data");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStoryData();
    else {
      setError("No story ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleSaveStory = async () => {
    try {
      console.log("Story saved successfully");
    } catch (err) {
      console.error("Error saving story:", err);
    }
  };

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 border-4 border-[#5C5E81] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-[#5C5E81] text-xl font-medium">
              Loading your story...
            </div>
          </motion.div>
        </motion.div>
      ) : error ? (
        <motion.div
          className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="text-red-600 text-xl font-semibold mb-2">
              Oops! Something went wrong
            </div>
            <div className="text-gray-600 mb-6">{error}</div>
            <Link
              to="/bookshelf"
              className="inline-flex items-center bg-[#5C5E81] text-white px-6 py-3 rounded-full font-medium hover:bg-[#4A4C6D] hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Bookshelf
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-purple-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <Link to="/edit-account">
            <div className="absolute top-6 right-6 z-100">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 bg-gradient-to-br from-[#5C5E81] to-[#7C7EA5]">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Link>
          <div className="flex flex-col flex-grow pr-5 pb-13 pl-5 md:pt-13 lg:pt-13 relative z-10">
            <div className="absolute top-6 left-8">
              <div
                className="text-[35px] font-bold text-[#5C5E81] tracking-wide mb-1"
                style={{ textShadow: "2px 2px 8px rgba(92, 94, 129, 0.15)" }}
              >
                TypeToTale
              </div>
              <div className="font-medium text-[12px] sm:text-[14px] text-[#8C8DA3] tracking-wide">
                Start to type to start telling a story together!
              </div>
            </div>

            <div className="items-center text-lg mt-30 font-bold md:mt-18 ml-10 md:flex">
              <Link
                to="/bookshelf"
                className="text-[23px] font-bold text-[#8C8DA3] hover:text-[#5C5E81] transition-colors duration-200"
              >
                Bookshelf
              </Link>
              <span className="mx-2 text-[#5C5E81]">{">"}</span>
              <span className="text-[23px] text-[#5C5E81] font-bold">
                create a story
              </span>
            </div>

            <div className="flex flex-1 justify-center items-center px-5 mt-5">
              <motion.div
                className="bg-gradient-to-br from-[#838FAF] to-[#6B7AA3] text-white rounded-3xl w-full max-w-[900px] h-auto p-8 shadow-2xl border border-white/20 backdrop-blur-sm relative overflow-hidden"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                  <motion.div
                    className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent text-center">
                    Story Complete!
                  </h2>
                  <p className="text-base sm:text-lg mb-6 opacity-90 max-w-md mx-auto leading-relaxed text-center">
                    Congratulations! Your creative journey has reached its
                    perfect ending.
                  </p>

                  {storyData?.theme && (
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span className="text-sm font-semibold">Theme: </span>
                        <span className="text-sm ml-1">{storyData.theme}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl p-6 mb-8 shadow-xl border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5C5E81] via-purple-400 to-indigo-400"></div>
                    <div className="mt-2">
                      <p className="text-base leading-relaxed whitespace-pre-wrap font-medium text-gray-700">
                        {storyData?.validStory || "No story content available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Created:{" "}
                        {storyData?.createdAt
                          ? new Date(storyData.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                    {storyData?.updatedAt && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Updated:{" "}
                          {new Date(storyData.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Link to="/bookshelf">
                      <motion.button
                        onClick={handleSaveStory}
                        className="group bg-gradient-to-r from-[#5C5E81] to-[#4A4C6D] text-white px-8 py-4 rounded-full font-semibold text-lg tracking-wide hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl border border-white/20 backdrop-blur-sm relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Go to Bookshelf
                        </span>
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
