import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
      style={{
        fontSize: "22px",
        color: "white",
        textAlign: "center",
        marginTop: "20px",
      }}
    >
      Loading…
    </motion.div>
  );
}
