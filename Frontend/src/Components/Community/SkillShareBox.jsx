import React, { useState } from "react";
import state from "../../Utils/Store";
import { useSnapshot } from "valtio";

// Theme colors (matching the previous component)
const themeColors = {
  primary: "#FFD100", // Vibrant yellow for main brand color
  secondary: "#FFBA08", // Warm amber yellow for secondary elements
  accent: "#FFC145", // Sunflower yellow for accents and highlights
  background: "#FFFAEB", // Soft cream-yellow for backgrounds
  surface: "#FFF8E1", // Light yellow for content surfaces
  cardBg: "#FFFFFF", // White background for cards
  textPrimary: "#2D2A32", // Deep charcoal for primary text
  textSecondary: "#645F68", // Muted gray for secondary text
  border: "rgba(0, 0, 0, 0.12)", // Subtle neutral border
  hover: "#FFB700", // Slightly darker yellow for hover effects
  danger: "#F86E51", // Warm-toned red for warnings
  success: "#4CAF50", // Balanced green for success messages
  gradient: "linear-gradient(135deg, #FFD100 0%, #FFBA08 100%)", // Dynamic yellow gradient
  lightAccent: "#FFF3CC", // Very light yellow for subtle highlights
  focus: "#F8C537", // Golden yellow for focus states
};
const SkillShareBox = () => {
  const snap = useSnapshot(state);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="my_post"
      onClick={() => {
        state.createSkillShareOpened = true;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: themeColors.gradient,
        padding: "16px 20px",
        borderRadius: "12px",
        boxShadow: isHovered 
          ? "0 8px 24px rgba(90, 155, 255, 0.2)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
        marginBottom: "20px",
        color: "white",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        border: `1px solid ${isHovered ? "rgba(255, 255, 255, 0.2)" : "transparent"}`,
        position: "relative",
        overflow: "hidden"
      }}
    >
       {/* Musical eighth note in bottom left - with increased opacity and shadow */}
      <div 
        style={{ 
          position: "absolute", 
          left: 50, 
          bottom: 5, 
          fontSize: "32px", 
          color: "#2D2A32", // Using dark color for better contrast
          textShadow: "0 0 3px rgba(255, 255, 255, 0.7)", // Adding shadow for better visibility
          zIndex: 1,
          transition: "transform 0.5s ease-in-out",
          transform: isHovered ? "scale(1.2) translateX(5px)" : "scale(1)",
          opacity: 0.85, // Much higher opacity
        }} 
      >
        ♫
      </div>

      {/* Music clef symbol in background - with increased opacity */}
      <div 
        style={{ 
          position: "absolute", 
          right: 55, 
          bottom: 10, 
          fontSize: "60px", // Larger size
          color: "#2D2A32", // Using dark color for better contrast
          textShadow: "0 0 3px rgba(255, 255, 255, 0.7)", // Adding shadow for better visibility
          zIndex: 1,
          transition: "transform 0.5s ease-in-out",
          transform: isHovered ? "scale(1.1) rotate(-5deg)" : "scale(1)",
          opacity: 0.7, // Higher opacity
        }} 
      >
        𝄢
      </div>

      <div
        className="post_top"
        style={{ 
          display: "flex", 
          alignItems: "center", 
          position: "relative", 
          zIndex: 2 
        }}
      >
        <img
          alt={snap.currentUser?.username || "Profile"}
          src={snap.currentUser?.image}
          style={{
            width: "45px",
            height: "45px",
            marginRight: "15px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.7)",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            boxShadow: isHovered ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none"
          }}
        />
        <input
          type="text"
          placeholder={`What skill are you sharing today, ${snap.currentUser?.username || "User"}?`}
          style={{
            flexGrow: 1,
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            color: themeColors.textPrimary,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            fontSize: "14px",
            transition: "all 0.3s ease",
            boxShadow: isHovered ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 2px 6px rgba(0, 0, 0, 0.04)",
            outline: "none"
          }}
          readOnly // Making input read-only since the whole component is clickable
          onClick={(e) => e.stopPropagation()} // Preventing input click from propagating
        />
      </div>
    </div>
  );
};

export default SkillShareBox;