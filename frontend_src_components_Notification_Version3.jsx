import { motion, AnimatePresence } from "framer-motion";

export default function Notification({ message, type, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-6 right-8 px-6 py-3 rounded-xl shadow-lg text-white font-semibold z-50
            ${type === "error" ? "bg-red-600" : "bg-blue-600"}`}
        >
          {message}
          <button onClick={onClose} className="ml-4 text-white font-bold">✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}