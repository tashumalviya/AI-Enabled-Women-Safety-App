import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [screen, setScreen] = useState("login");
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [otpMethod, setOtpMethod] = useState("sms");
  const [onboardingStep, setOnboardingStep] = useState(0);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <AppContext.Provider value={{
      screen, setScreen,
      theme, toggleTheme,
      user, setUser,
      otpMethod, setOtpMethod,
      onboardingStep, setOnboardingStep
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
