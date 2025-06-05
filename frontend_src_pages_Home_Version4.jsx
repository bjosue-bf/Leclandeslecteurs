import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-extrabold text-white mb-4"
      >
        Amazing FileShare
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-xl text-white/90 mb-8 text-center"
      >
        Plateforme moderne pour partager, explorer et télécharger tous tes fichiers !
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="flex gap-4"
      >
        <Link
          to="/register"
          className="px-8 py-3 rounded bg-gradient-to-r from-purple-500 to-blue-500 font-bold text-lg hover:scale-105 transition"
        >
          Créer un compte
        </Link>
        <Link
          to="/gallery"
          className="px-8 py-3 rounded border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition"
        >
          Explorer la galerie
        </Link>
      </motion.div>
    </section>
  );
}