import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sun, Moon, ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import "./OtpVerify.css";

const CORRECT_OTP = "123456";
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const METHOD_LABELS = {
  sms: "📩 SMS",
  whatsapp: "💬 WhatsApp",
  call: "📞 Voice Call",
};

export default function OtpVerify() {
  const { theme, toggleTheme, setScreen, otpMethod, user } = useApp();
  const dark = theme === "dark";

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState("idle");
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const t = setTimeout(() => setTimer(p => p - 1), 1000);
      return () => clearTimeout(t);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setStatus("idle");

    if (val && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();

    if (next.every(d => d !== "")) {
      setTimeout(() => verify(next.join("")), 80);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const verify = (code) => {
    setStatus("loading");
    setTimeout(() => {
      if (code === CORRECT_OTP) {
        setStatus("success");
        setTimeout(() => setScreen(user?.isNew ? "onboarding" : "dashboard"), 1200);
      } else {
        setStatus("error");
        setOtp(Array(OTP_LENGTH).fill(""));
        setTimeout(() => refs.current[0]?.focus(), 100);
      }
    }, 1200);
  };

  return (
    <div className={`otp-container ${dark ? "dark" : ""}`}>
      
      {/* Top Bar */}
      <div className="top-bar">
        <div className="left">
          <button onClick={() => setScreen("otp-method")} className="icon-btn">
            <ArrowLeft size={16} />
          </button>

          <div className="logo">
            <Shield size={18} />
          </div>

          <span className="app-name">SheSafe</span>
        </div>

        <button onClick={toggleTheme} className="icon-btn">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Card */}
      <motion.div className="otp-card">
        <div className="center">
          <div className="lock">🔐</div>
          <h2>Verify OTP</h2>
          <p>
            Enter code sent to <span>+91 {user?.phone}</span>
          </p>
          <div className="method">via {METHOD_LABELS[otpMethod]}</div>
        </div>

        {/* OTP Inputs */}
        <div className="otp-boxes">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => refs.current[i] = el}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1}
              className={`otp-input ${digit ? "filled" : ""} ${status === "error" ? "error" : ""}`}
            />
          ))}
        </div>

        {/* Status */}
        <AnimatePresence>
          {status === "error" && (
            <div className="error-msg">
              <XCircle size={16} /> Invalid OTP
            </div>
          )}
          {status === "success" && (
            <div className="success-msg">
              <CheckCircle size={16} /> Verified!
            </div>
          )}
        </AnimatePresence>

        {/* Button */}
        <button className="verify-btn">
          {status === "loading" ? <Loader2 className="spin" /> : "Verify"}
        </button>

        {/* Footer */}
        <div className="footer">
          <button disabled={!canResend}>
            {canResend ? "Resend OTP" : `Resend in ${timer}s`}
          </button>
          <button onClick={() => setScreen("login")}>Change Number</button>
        </div>
      </motion.div>
    </div>
  );
}