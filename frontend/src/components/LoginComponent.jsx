import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const data = response.data;

      if (!data.userLogin?.status) {
        setLoginError(data.userLogin.msg || "Login failed");
      } else {
        const { token, user } = data.userLogin;
        localStorage.setItem("token", token.token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      }
    } catch (error) {
      setLoginError(error.response?.data?.msg || "Failed to login. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px] lg:min-h-[700px]">
          <div className="flex flex-col lg:flex-row">
            {/* Animated Brand Section */}
            <motion.div
              className="lg:w-1/2 bg-gradient-to-br from-[#5C5E81] to-[#838FAF] relative flex items-center justify-center p-8 lg:p-12 min-h-[200px] lg:min-h-[700px]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-16 right-12 w-24 h-24 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-16 left-10 w-20 h-20 border-2 border-white rounded-lg rotate-12"></div>
                <div className="absolute top-1/3 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-1/3 right-8 w-10 h-10 bg-white rounded-full"></div>
                <div className="absolute top-2/3 left-16 w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div className="text-center lg:text-left relative z-10">
                <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  TypeToTale
                </h2>
                <p className="text-purple-100 text-lg lg:text-xl font-light max-w-md">
                  Continue your storytelling adventure
                </p>
                <div className="mt-8 flex justify-center lg:justify-start space-x-3">
                  <div className="w-8 h-1 bg-white rounded-full"></div>
                  <div className="w-4 h-1 bg-purple-200 rounded-full"></div>
                  <div className="w-2 h-1 bg-purple-300 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Animated Form Section */}
            <motion.div
              className="lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#5C5E81] to-[#838FAF] rounded-full mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-[#5C5E81] mb-2">Sign In</h3>
                  <p className="text-gray-600 text-base">Access your TypeToTale account</p>
                </div>

                {/* Animated Error Message */}
                {loginError && (
                  <motion.div
                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-red-700 text-sm font-medium">{loginError}</p>
                  </motion.div>
                )}

                {/* Form */}
                <div className="space-y-6">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#838FAF] focus:border-transparent ${
                          errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#838FAF] focus:border-transparent ${
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
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Animated Submit Button */}
                  <motion.button
                    onClick={handleLogin}
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
                          ></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <a
                      href="/signup"
                      className="text-[#5C5E81] hover:text-[#838FAF] font-semibold transition-colors"
                    >
                      Create Account
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
