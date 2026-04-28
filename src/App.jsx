import { AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContext";
import Login from "./pages/Login";
import OtpMethod from "./pages/OtpMethod";
import OtpVerify from "./pages/OtpVerify";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

function AppRouter() {
  const { screen } = useApp();
  return (
    <AnimatePresence mode="wait">
      {screen === "login"      && <Login key="login" />}
      {screen === "otp-method" && <OtpMethod key="otp-method" />}
      {screen === "otp-verify" && <OtpVerify key="otp-verify" />}
      {screen === "onboarding" && <Onboarding key="onboarding" />}
      {screen === "dashboard"  && <Dashboard key="dashboard" />}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
