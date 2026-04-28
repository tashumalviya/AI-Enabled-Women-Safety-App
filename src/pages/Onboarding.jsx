import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import "./Onboarding.css";

const SCREENS = [
  {
    emoji: "🛡️",
    title: "Stay Safe Anytime, Anywhere",
    desc: "SheSafe keeps you protected 24/7 with real-time location sharing, emergency alerts, and smart safety features.",
  },
  {
    emoji: "🚨",
    title: "Instant SOS Alert",
    desc: "One tap sends your location to emergency contacts and authorities.",
  },
  {
    emoji: "✨",
    title: "Smart Safety Features",
    desc: "AI-powered route suggestions and safety ratings.",
  },
];

export default function Onboarding() {
  const { theme, setScreen, onboardingStep, setOnboardingStep, user } = useApp();
  const dark = theme === "dark";
  const step = onboardingStep;
  const s = SCREENS[step];

  const handleNext = () => {
    if (step < SCREENS.length - 1) setOnboardingStep(step + 1);
    else setScreen("dashboard");
  };

  const handleBack = () => {
    if (step > 0) setOnboardingStep(step - 1);
    else setScreen("otp-verify");
  };

  return (
    <div className={`onboarding-container ${dark ? "dark" : ""}`}>

      <AnimatePresence mode="wait">
        <motion.div key={step} className="onboarding-card"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}>

          {/* Emoji */}
          <div className="emoji-box">
            <motion.span className="emoji">{s.emoji}</motion.span>
          </div>

          {/* Text */}
          <div className="text-center">
            <h2>{s.title}</h2>
            <p>{s.desc}</p>
          </div>

          {/* User Info */}
          {user && (
            <div className="user-card">
              <p className="label">Your Details</p>
              <div>👤 {user.name}</div>
              <div>📱 +91 {user.phone}</div>
              {user.email && <div>✉️ {user.email}</div>}
            </div>
          )}

          {/* Dots */}
          <div className="dots">
            {SCREENS.map((_, i) => (
              <div key={i} className={`dot ${i === step ? "active" : ""}`} />
            ))}
          </div>

          {/* Buttons */}
          <div className="buttons">
            <button onClick={handleBack} className="back-btn">
              <ArrowLeft size={16} /> Back
            </button>

            <button onClick={handleNext} className="next-btn">
              {step === SCREENS.length - 1 ? "Get Started 🚀" : <>Next <ArrowRight size={16} /></>}
            </button>
          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
}