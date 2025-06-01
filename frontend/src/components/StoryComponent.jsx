import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Adjust the import based on your routing library
import axiosInstance from "../api/axiosInstance"; // Adjust the import based on your project structure
export default function StoryTypingChallenge() {
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typingSession, setTypingSession] = useState(null);
  const [validParagraphs, setValidParagraphs] = useState([]);
  const [invalidParagraphs, setInvalidParagraphs] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { id } = useParams(); // Assuming you're using react-router for routing
  const navigate = useNavigate(); // Import useNavigate from react-router-dom if needed
  // Enhanced paragraph parsing function
  const parseStoryParagraphs = (storyText) => {
    if (!storyText) return [];

    // Split by multiple possible delimiters and clean up
    const paragraphs = storyText
      .split(/\||\n\n|\r\n\r\n/) // Split by |, double newlines, or double CRLF
      .map((paragraph) => paragraph.trim()) // Remove leading/trailing whitespace
      .filter((paragraph) => paragraph.length > 0); // Remove empty paragraphs

    return paragraphs;
  };

  // Validate paragraph pairs
  const validateParagraphPairs = (validParas, invalidParas) => {
    const minLength = Math.min(validParas.length, invalidParas.length);

    if (validParas.length !== invalidParas.length) {
      console.warn(
        `Paragraph count mismatch: Valid(${validParas.length}) vs Invalid(${invalidParas.length})`
      );
    }

    return {
      valid: validParas.slice(0, minLength),
      invalid: invalidParas.slice(0, minLength),
    };
  };

  // Fetch typing session data from your backend
  useEffect(() => {
    const fetchTypingSession = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("No typing session ID provided");
          return;
        }

        // Call your backend API
        const response = await axiosInstance.get(
          `/secure/typing-session/${id}`
        );
        console.log("Typing session response:", response.data.book);

        if (response.data.status && response.data.book) {
          const session = response.data.book.session;
          setTypingSession(session);

          // Enhanced paragraph parsing
          const validParas = parseStoryParagraphs(session.validStory);
          const invalidParas = parseStoryParagraphs(session.invalidStory);

          // Validate and sync paragraph pairs
          const { valid, invalid } = validateParagraphPairs(
            validParas,
            invalidParas
          );

          setValidParagraphs(valid);
          setInvalidParagraphs(invalid);
          setIsCompleted(session.status);

          console.log(`Loaded ${valid.length} paragraph pairs`);
          console.log("Valid paragraphs:", valid);
          console.log("Invalid paragraphs:", invalid);
        } else {
          setError("Failed to load typing session");
        }
      } catch (err) {
        console.error("Error fetching typing session:", err);
        setError("Failed to connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTypingSession();
  }, [id]);

  // Complete session when all paragraphs are done
  const completeSession = async () => {
    try {
      // Update session status to completed
      await axiosInstance.put(`/secure/typing-session/${id}`, {
        status: true,
      });

      setIsCompleted(true);
      setShowSuccess(true);
      setTimeout(() => {
        // navigate(`/complete-story/${id}`);
        navigate("/bookshelf");
      }, 2000);
    } catch (err) {
      console.error("Error completing session:", err);
      // Continue anyway - the user completed the challenge
      setIsCompleted(true);
      setShowSuccess(true);
      setTimeout(() => {
        console.log("Navigating to complete story page (fallback)");
      }, 2000);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    const currentValidParagraph = validParagraphs[currentIndex];

    // Normalize text for comparison (trim whitespace and normalize line endings)
    const normalizedInput = value.trim().replace(/\r\n/g, "\n");
    const normalizedTarget = currentValidParagraph
      ?.trim()
      .replace(/\r\n/g, "\n");

    if (normalizedInput === normalizedTarget) {
      if (currentIndex < validParagraphs.length - 1) {
        setShowSuccess(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setUserInput("");
          setShowSuccess(false);
        }, 800);
      } else {
        setTimeout(() => {
          completeSession();
        }, 800);
      }
    }
  };

  // Enhanced error counting with word-level analysis
  const getErrorCount = () => {
    const currentInvalidParagraph = invalidParagraphs[currentIndex];
    const currentValidParagraph = validParagraphs[currentIndex];

    if (!currentInvalidParagraph || !currentValidParagraph) return 0;

    // Split into words and compare
    const invalidWords = currentInvalidParagraph.toLowerCase().split(/\s+/);
    const validWords = currentValidParagraph.toLowerCase().split(/\s+/);
    let errorCount = 0;

    // Count word differences
    const maxLength = Math.max(invalidWords.length, validWords.length);
    for (let i = 0; i < maxLength; i++) {
      const invalidWord = invalidWords[i] || "";
      const validWord = validWords[i] || "";

      if (invalidWord !== validWord) {
        errorCount++;
      }
    }

    return errorCount;
  };

  // Enhanced match percentage calculation
  const getMatchPercentage = () => {
    const currentValidParagraph = validParagraphs[currentIndex];
    if (!userInput.trim() || !currentValidParagraph) return 0;

    const inputWords = userInput.trim().toLowerCase().split(/\s+/);
    const validWords = currentValidParagraph.toLowerCase().split(/\s+/);
    let matches = 0;

    const minLength = Math.min(inputWords.length, validWords.length);
    for (let i = 0; i < minLength; i++) {
      if (inputWords[i] === validWords[i]) matches++;
    }

    return Math.round((matches / validWords.length) * 100);
  };

  // Progress calculation
  const getProgress = () => {
    if (validParagraphs.length === 0) return 0;
    return Math.round(
      ((currentIndex + (userInput.length > 0 ? 0.5 : 0)) /
        validParagraphs.length) *
        100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="text-slate-600 text-lg font-medium">
            Loading your story challenge...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-400 text-2xl">📚</span>
          </div>
          <div className="text-slate-700 text-lg font-semibold mb-2">
            Challenge Not Found
          </div>
          <div className="text-slate-500 mb-6">{error}</div>
          <button
            onClick={() => (window.location.href = "/bookshelf")}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Browse Challenges
          </button>
        </div>
      </div>
    );
  }

  const currentInvalidParagraph = invalidParagraphs[currentIndex];
  const currentValidParagraph = validParagraphs[currentIndex];
  const errorCount = getErrorCount();
  const matchPercentage = getMatchPercentage();
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-7 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => (window.location.href = "/bookshelf")}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <span className="text-xl">←</span>
              <span className="font-medium">Back to Bookshelf</span>
            </button>
            <div className="text-slate-300">|</div>
            <div className="text-slate-700 font-semibold">
              {typingSession?.theme}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress indicator */}
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-sm text-slate-600">Progress:</span>
              <span className="text-sm font-bold text-indigo-600">
                {progress}%
              </span>
            </div>

            {/* Profile */}
            <button
              onClick={() => (window.location.href = "/edit-account")}
              className="absolute top-6 right-6 z-10 group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#5C5E81] cursor-pointer shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                <img
                  src="/path-to-user-image.jpg" // Replace with actual image path or state
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.style.background =
                      "linear-gradient(135deg, #5C5E81, #838FAF)";
                    e.target.parentElement.innerHTML =
                      '<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg">U</div>';
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#5C5E81] via-[#838FAF] to-[#5C5E81] bg-clip-text text-transparent mb-3">
            TypeToTale
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Master your typing skills through storytelling
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <div className="bg-slate-100 rounded-full h-3 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#5C5E81] to-[#838FAF] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-600">
            <span>
              Paragraph {currentIndex + 1} of {validParagraphs.length}
            </span>
            <span>{progress}% Complete</span>
          </div>
        </div>

        {/* Main Challenge Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#5C5E81] to-[#838FAF]  p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Spot & Fix the Errors
                </h2>
                <p className="text-indigo-100 text-lg">
                  Find and correct the mistakes in paragraph {currentIndex + 1}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {errorCount}
                </div>
                <div className="text-indigo-200 text-sm">Errors Found</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {matchPercentage}%
                </div>
                <div className="text-indigo-200 text-sm">Match Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {userInput.length}
                </div>
                <div className="text-indigo-200 text-sm">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {currentIndex + 1}/{validParagraphs.length}
                </div>
                <div className="text-indigo-200 text-sm">Paragraph</div>
              </div>
            </div>
          </div>

          <div className="p-10">
            {/* Desktop Layout: Side by Side with improved spacing */}
            <div className="grid lg:grid-cols-2 lg:gap-12 space-y-8 lg:space-y-0">
              {/* Left Side - Error Text Display */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span>Text with Errors</span>
                  </h3>
                  <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span>
                      {errorCount} error{errorCount !== 1 ? "s" : ""} found
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 min-h-[300px] relative overflow-hidden">
                  <div className="prose prose-lg text-slate-800 leading-relaxed font-medium">
                    {currentInvalidParagraph}
                  </div>
                </div>
              </div>

              {/* Right Side - User Input Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        showSuccess ? "bg-green-500" : "bg-blue-500"
                      }`}
                    ></span>
                    <span>Your Corrected Version</span>
                  </h3>
                  {showSuccess && (
                    <div className="flex items-center space-x-2 text-green-600 animate-bounce">
                      <span className="text-2xl">✅</span>
                      <span className="font-bold text-lg">Perfect!</span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    value={userInput}
                    onChange={handleChange}
                    placeholder="Type the corrected paragraph here..."
                    className={`w-full h-[300px] p-8 text-lg text-slate-800 bg-gradient-to-br border-2 rounded-2xl focus:outline-none resize-none transition-all duration-300 font-medium leading-relaxed ${
                      showSuccess
                        ? "from-green-50 to-green-100 border-green-400 shadow-green-200 shadow-lg"
                        : matchPercentage >= 80
                        ? "from-blue-50 to-blue-100 border-blue-400 shadow-blue-200 shadow-lg"
                        : "from-slate-50 to-slate-100 border-slate-300 focus:border-[#5C5E81] focus:shadow-indigo-200 focus:shadow-lg hover:border-slate-400"
                    }`}
                    disabled={isCompleted}
                  />

                  {/* Character count and status indicator */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
                      <div
                        className={`w-3 h-3 rounded-full animate-pulse ${
                          matchPercentage >= 90
                            ? "bg-green-500"
                            : matchPercentage >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-slate-600">
                        {userInput.length} chars
                      </span>
                    </div>
                  </div>

                  {/* Real-time feedback */}
                  {userInput.length > 0 && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
                      <div className="text-sm font-bold text-slate-700">
                        {matchPercentage}% match
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Completion Message */}
            {isCompleted && (
              <div className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <span className="text-green-600 text-2xl">🎉</span>
                </div>
                <div>
                  <div className="text-green-800 font-bold text-xl">
                    Story Challenge Completed!
                  </div>
                  <div className="text-green-600 text-lg">
                    You've successfully corrected all {validParagraphs.length}{" "}
                    paragraphs! Redirecting to your story...
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Helper Tips */}
            <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xl">💡</span>
                </div>
                <div className="text-blue-800 space-y-3">
                  <h4 className="font-bold text-lg">Pro Tips:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        Look carefully for spelling mistakes and typos
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Check for missing or extra words</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Pay attention to punctuation marks</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Match spacing and capitalization exactly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
