import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  Edit3,
  User,
  Mail,
  Camera,
  Save,
  LogOut,
  CheckCircle,
  AlertCircle,
  X,
  Trash2,
  RefreshCw,
  ChevronRight,
  BookOpen,
  Home,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

function UserEditAcc() {
  const [profileImage, setProfileImage] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [originalProfileImage, setOriginalProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [originalFormData, setOriginalFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Enhanced user data loading with error handling
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const initialData = {
            username: userData.username || "",
            email: userData.email || "",
          };
          setUserId(userData.id);
          setFormData(initialData);
          setOriginalFormData(initialData);
          if (userData.img_url) {
            setProfileImage(userData.img_url);
            setOriginalProfileImage(userData.img_url);
          }
        } else {
          console.warn("No user data found in localStorage");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setErrors({ load: "Failed to load user data" });
      }
    };
    loadUserData();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const hasFormChanges =
      JSON.stringify(formData) !== JSON.stringify(originalFormData);
    const hasImageChanges = profileFile !== null;
    setHasUnsavedChanges(hasFormChanges || hasImageChanges);
  }, [formData, originalFormData, profileFile]);

  // Prevent leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Enhanced image validation
  const validateImageFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, or WebP)";
    }
    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }
    return null;
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile) {
      const error = validateImageFile(imageFile);
      if (error) {
        setErrors((prev) => ({ ...prev, image: error }));
        return;
      }
      const imageUrl = URL.createObjectURL(imageFile);
      setProfileImage(imageUrl);
      setProfileFile(imageFile);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  }, []);

  // Enhanced image upload with better error handling
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, image: error }));
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    setProfileFile(file);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoveImage = () => {
    setProfileImage(originalProfileImage);
    setProfileFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // Enhanced validation
  const validateForm = (data) => {
    const errors = {};
    if (!data.username.trim()) {
      errors.username = "Username is required";
    } else if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (data.username.length > 20) {
      errors.username = "Username must be less than 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    }
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      setFormData(originalFormData);
      setProfileImage(originalProfileImage);
      setProfileFile(null);
      setErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setShowSuccess(false);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username.trim());
      formDataToSend.append("email", formData.email.trim());
      if (profileFile) {
        formDataToSend.append("image", profileFile);
      }
      const response = await axiosInstance.put(
        `/secure/edit-profile/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data.status) {
        setShowSuccess(true);
        setErrors({});
        if (response.data.user) {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = {
            ...currentUser,
            username: formData.username,
            email: formData.email,
            ...(profileFile &&
              response.data.user.updatedUser.user_image && {
                img_url: response.data.user.updatedUser.user_image,
              }),
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          const newOriginalData = { ...formData };
          setOriginalFormData(newOriginalData);
          setFormData(newOriginalData);
          setOriginalProfileImage(profileImage);
          setProfileFile(null);
        }
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error(response.data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving account:", error);
      setErrors({
        submit:
          error.response?.data?.error ||
          "Failed to update account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    };
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to logout?",
        )
      ) {
        confirmLogout();
      }
    } else {
      confirmLogout();
    }
  };

  const handleBreadcrumbNavigation = (path) => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave this page?",
        )
      ) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8AA0BD] via-[#7B94B3] to-[#6B87A8] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div
        className="absolute top-6 left-8 text-white text-[35px] font-bold tracking-wide z-10"
        style={{ textShadow: "3px 3px 8px rgba(0, 0, 0, 0.3)" }}
      >
        <Link to="/">TypeToTale</Link>
      </div>

      {/* Breadcrumb Navigation */}
      <motion.div
        className="absolute top-20 left-8 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <nav className="flex items-center space-x-3 text-sm font-medium">
          <motion.button
            onClick={() => handleBreadcrumbNavigation("/")}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 group"
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span>Home</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <ChevronRight size={16} className="text-white/60" />
          </motion.div>

          <motion.button
            onClick={() => handleBreadcrumbNavigation("/bookshelf")}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 group"
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span>Bookshelf</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <ChevronRight size={16} className="text-white/60" />
          </motion.div>

          <motion.span
            className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <User size={16} />
            Account Settings
          </motion.span>
        </nav>
      </motion.div>

      {/* Success notification */}
      {showSuccess && (
        <motion.div
          className="fixed top-6 right-6 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2 z-50"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircle size={20} />
          <span>Profile updated successfully!</span>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-2 hover:bg-green-600 rounded p-1"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* Main content */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-6xl mt-32 md:mt-20 relative z-10">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <User className="text-[#5C5E81]" size={32} />
            <h1 className="text-[35px] font-bold text-[#5C5E81]">
              Account Settings
            </h1>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
              <AlertCircle size={16} />
              <span>Unsaved changes</span>
            </div>
          )}
        </div>

        <div className="flex md:flex-row flex-col items-start md:gap-12 gap-8">
          {/* Enhanced Profile Picture Section */}
          <div className="flex-shrink-0 md:mx-0 mx-auto">
            <div className="relative group">
              <div
                className={`w-52 h-52 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden flex items-center justify-center shadow-lg border-4 transition-all duration-300 ${
                  isDragging
                    ? "border-[#5C5E81] border-dashed bg-blue-50"
                    : "border-white"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-[#53675E] text-center">
                    <Camera size={32} className="mx-auto mb-2 opacity-50" />
                    <div className="font-light text-[14px] opacity-70">
                      {isDragging ? "Drop image here" : "No Image"}
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditClick}
                className="absolute bottom-4 right-12 bg-[#5C5E81] hover:bg-[#3E4283] rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              >
                <Edit3 size={18} className="text-white" />
              </button>

              {/* Remove Image Button */}
              {profileFile && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute bottom-4 right-0 bg-red-500 hover:bg-red-600 rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                >
                  <Trash2 size={18} className="text-white" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="text-center mt-4">
              <p className="font-light text-[14px] text-[#7B7B7B]">
                Click edit to upload or drag & drop
              </p>
              <p className="text-xs text-[#9D9191] mt-1">
                JPEG, PNG, WebP • Max 5MB
              </p>
              {errors.image && (
                <div className="flex items-center justify-center gap-1 mt-2 text-red-500 text-sm">
                  <AlertCircle size={14} />
                  <span>{errors.image}</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Form Section */}
          <div className="flex-1 space-y-6 w-full md:mt-6">
            {/* Basic Info Section */}
            <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-[#5C5E81] flex items-center gap-2">
                <User size={20} />
                Profile Information
              </h3>

              {/* Username Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#5C5E81] font-medium text-sm">
                  <User size={16} />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 font-light text-[16px] bg-white rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                    errors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-[#5C5E81] focus:ring-2 focus:ring-[#5C5E81]/20"
                  }`}
                />
                {errors.username && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.username}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#5C5E81] font-medium text-sm">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 font-light text-[16px] bg-white rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-[#5C5E81] focus:ring-2 focus:ring-[#5C5E81]/20"
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.submit}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleSave}
                disabled={isSubmitting || !hasUnsavedChanges}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium text-[16px] transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isSubmitting || !hasUnsavedChanges
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#5C5E81] hover:bg-[#3E4283] text-white hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                disabled={!hasUnsavedChanges || isSubmitting}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium text-[16px] transition-all duration-300 shadow-lg hover:shadow-xl ${
                  !hasUnsavedChanges || isSubmitting
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105"
                }`}
              >
                <RefreshCw size={16} />
                Reset Changes
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium text-[16px] bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEditAcc;
