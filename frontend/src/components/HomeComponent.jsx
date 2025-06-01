import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePageComponent() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleBookClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      }
      navigate("/bookshelf");
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#838FAF] to-[#8AA0BD] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse sm:block hidden"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={`lg-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse lg:block hidden"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Flash overlay for transition effect */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-opacity duration-300 pointer-events-none ${
          isAnimating ? "opacity-90" : "opacity-0"
        }`}
        style={{
          background: isAnimating
            ? "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(131,143,175,0.8) 100%)"
            : "transparent",
        }}
      />

      {/* Swipe overlay */}
      <div
        className={`fixed inset-0 z-40 pointer-events-none transition-transform duration-700 ease-in-out ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(131,143,175,0.3) 30%, rgba(255,255,255,0.6) 50%, rgba(131,143,175,0.3) 70%, transparent 100%)",
          transform: isAnimating ? "translateX(-100vw)" : "translateX(100vw)",
          transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />

      {/* Main content container */}
      <div
        className={`flex items-center justify-center min-h-screen py-8 sm:py-16 px-4 relative z-10 transition-all duration-700 ${
          isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100"
        }`}
      >
        <div
          className={`relative transition-all duration-700 cursor-pointer ${
            isHovered ? "scale-105" : "scale-100"
          } ${isAnimating ? "animate-pulse" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleBookClick}
        >
          {/* Book container */}
          <div
            className="relative w-[280px] h-[350px] sm:w-[360px] sm:h-[450px] md:w-[440px] md:h-[520px] lg:w-[520px] lg:h-[600px] transform -rotate-1 sm:-rotate-2 lg:-rotate-3 shadow-xl sm:shadow-2xl hover:shadow-3xl"
            style={{
              transformStyle: "preserve-3d",
              filter:
                "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.4)) sm:drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))",
            }}
          >
            {/* Book spine */}
            <div className="absolute left-0 top-0 h-full w-[60px] sm:w-[80px] lg:w-[105px] bg-gradient-to-b from-slate-700 via-slate-600 to-slate-800 rounded-l-md border-r-2 border-slate-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 rounded-l-md"></div>
            </div>

            {/* Front cover */}
            <div className="absolute left-[50px] sm:left-[70px] lg:left-[90px] top-0 h-full w-[230px] sm:w-[290px] md:w-[370px] lg:w-[430px] bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-r-md flex flex-col justify-between items-center py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 transition-opacity duration-500">
              <div className="flex-1 flex flex-col justify-center items-center space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="text-center space-y-1 sm:space-y-2">
                  <h1 className="text-slate-700 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-wide">
                    Your keyboard
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-lg md:text-xl lg:text-2xl font-light italic">
                    is the pen.
                  </p>
                </div>

                <div className="h-px w-12 sm:w-16 lg:w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent my-3 sm:my-4 lg:my-6"></div>

                <div className="text-center space-y-1 sm:space-y-2">
                  <h2 className="text-slate-700 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-wide">
                    Your thoughts,
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-lg md:text-xl lg:text-2xl font-light italic">
                    the story.
                  </p>
                </div>
              </div>

              {/* Button placeholder */}
              <div className="invisible h-8" />
            </div>
          </div>

          {/* Subtle blur only on click */}
          <div
            className={`absolute -inset-4 rounded-lg transition-all duration-300 pointer-events-none ${
              isAnimating ? "bg-white/5 backdrop-blur-sm" : "bg-transparent"
            }`}
          />
        </div>
      </div>

      {/* Brand title */}
      <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 z-20">
        <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl tracking-wider">
          <span className="bg-gradient-to-r from-[#5C5E81] via-[#838FAF] to-[#5C5E81] bg-clip-text text-transparent">
            TypeToTale
          </span>
        </h1>
        <div className="h-0.5 sm:h-1 w-16 sm:w-20 lg:w-24 bg-gradient-to-r from-[#5C5E81] via-[#838FAF] to-[#5C5E81] rounded-full mt-1 sm:mt-2 animate-pulse"></div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
}
