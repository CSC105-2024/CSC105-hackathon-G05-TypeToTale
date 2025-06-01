import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

export default function SignUpComponent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    else if (username.length < 3) newErrors.username = "Username must be at least 3 characters";

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/signup", {
        username,
        email,
        password,
      });

      if (!response.data.status) {
        setSignupError(response.data.msg || "Signup failed");
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      setSignupError(
        error.response?.data?.msg || "Failed to sign up. Please try again."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px] lg:min-h-[700px]">
          <div className="flex flex-col lg:flex-row">
            {/* Left Panel with Animation */}
            <motion.div
              className="lg:w-1/2 bg-gradient-to-br from-[#5C5E81] to-[#838FAF] relative flex items-center justify-center p-8 lg:p-12 min-h-[200px] lg:min-h-[700px]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-20 right-16 w-16 h-16 border-2 border-white rounded-lg rotate-45"></div>
                <div className="absolute top-1/2 left-8 w-12 h-12 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-32 left-20 w-8 h-8 bg-white rounded-full"></div>
              </div>
              <div className="text-center lg:text-left relative z-10">
                <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  TypeToTale
                </h2>
                <p className="text-white/80 text-lg font-light max-w-md">
                  Transform your thoughts into captivating stories
                </p>
                <div className="mt-8 flex justify-center lg:justify-start space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </motion.div>

            {/* Right Panel with Animation */}
            <motion.div
              className="lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSignup} className="max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-bold text-[#5C5E81] mb-2">Create Account</h3>
                  <p className="text-gray-600 text-base">Join TypeToTale and start your storytelling journey</p>
                </div>

                {/* Animated Error Message */}
                {signupError && (
                  <motion.div
                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-red-700 text-sm font-medium">{signupError}</p>
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#838FAF] ${
                        errors.username ? "border-red-300 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#838FAF] ${
                        errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#838FAF] ${
                          errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#838FAF] ${
                          errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Submit Button with Animation */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#5C5E81] to-[#838FAF] text-white py-3 rounded-xl font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>
                </div>

                {/* Footer Link */}
                <div className="text-center mt-8">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-[#5C5E81] hover:text-[#838FAF] font-semibold transition-colors">
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
