import { useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Vidéo" },
  { value: "ebook", label: "eBook" },
  { value: "cours", label: "Cours" },
  { value: "film", label: "Film" },
  { value: "autre", label: "Autre" },
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("");

  const handleInput = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file) return setStatus("Sélectionne un fichier !");
    const form = new FormData();
    form.append("file", file);
    form.append("category", category);
    form.append("description", description);
    form.append("tags", tags);
    const token = localStorage.getItem("token"); // pour lier à l'utilisateur
    const res = await fetch("http://localhost:4000/api/files/upload", {
      method: "POST",
      body: form,
      headers: token ? { Authorization: "Bearer " + token } : {},
    });
    if (res.ok) setStatus("Upload réussi !");
    else setStatus("Erreur lors de l'upload");
  };

  return (
    <motion.section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="w-96 flex flex-col gap-4 bg-white/10 p-8 rounded-3xl items-center shadow-xl">
        <input type="file" onChange={handleInput} />
        <select
          className="p-2 rounded w-full"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Catégorie</option>
          {CATEGORIES.map((cat) => (
            <option value={cat.value} key={cat.value}>{cat.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Description (optionnel)"
          className="p-2 rounded w-full"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (séparés par virgule)"
          className="p-2 rounded w-full"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <button
          onClick={handleUpload}
          className="px-6 py-2 rounded bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold text-lg shadow hover:scale-105 transition"
        >
          Uploader
        </button>
        {status && <div className="mt-4 text-white">{status}</div>}
      </div>
    </motion.section>
  );
}