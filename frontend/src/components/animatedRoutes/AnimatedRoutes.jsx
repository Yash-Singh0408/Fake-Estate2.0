// src/components/AuthPageWrapper.jsx
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const AuthPageWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // Slide direction based on path
  const isRegister = path === "/register";

  return (
    <motion.div
      key={path + Math.random()}
      initial={{ x: isRegister ? 300 : -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: isRegister ? -300 : 300, opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

export default AuthPageWrapper;
