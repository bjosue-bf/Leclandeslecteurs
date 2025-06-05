import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { value: "", label: "Toutes" },
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Vidéo" },
  { value: "ebook", label: "eBook" },
  { value: "cours", label: "Cours" },
  { value: "film", label: "Film" },
  { value: "autre", label: "Autre" },
];

export default function Gallery() {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/files")
      .then(res => res.json())
      .then(setFiles);
  }, []);

  const filtered = files.filter(f =>
    (!filter || f.category === filter) &&
    (!search ||
      (f.originalname && f.originalname.toLowerCase().includes(search.toLowerCase())) ||
      (f.tags && f.tags.join(" ").toLowerCase().includes(search.toLowerCase()))
    )
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Galerie de fichiers</h2>
        <div className="flex gap-4 mb-6">
          <select
            className="p-2 rounded"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option value={cat.value} key={cat.value}>{cat.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Rechercher par nom ou tag"
            className="p-2 rounded flex-1"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
        >
          {filtered.map((f) => (
            <motion.a
              key={f._id}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 rounded-xl p-4 flex flex-col gap-2 hover:bg-white/20 transition cursor-pointer"
              whileHover={{ scale: 1.04, boxShadow: "0px 4px 20px rgba(88,101,242,0.15)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              download
            >
              <span className="text-lg font-semibold text-white">{f.originalname}</span>
              <span className="text-xs text-purple-200">Catégorie : {f.category}</span>
              {f.tags && f.tags.length > 0 && (
                <span className="text-xs text-blue-200">
                  {f.tags.map(t => `#${t}`).join(" ")}
                </span>
              )}
              <span className="text-white/80 text-xs">{f.description}</span>
              <span className="text-xs text-gray-200">
                Ajouté le {new Date(f.createdAt).toLocaleDateString()}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}