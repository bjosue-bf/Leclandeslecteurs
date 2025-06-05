import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          fetch(`http://localhost:4000/api/files/user/${data.user.id}`, {
            headers: { Authorization: "Bearer " + token }
          })
            .then(res => res.json())
            .then(setFiles);
        } else {
          navigate("/login");
        }
      });
  }, [navigate]);

  if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Chargement…</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Mes fichiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {files.map(f => (
            <div key={f._id} className="bg-white/10 rounded-xl p-4 flex flex-col gap-2">
              <span className="text-lg font-semibold text-white">{f.originalname}</span>
              <span className="text-xs text-purple-200">Catégorie : {f.category}</span>
              {f.tags && f.tags.length > 0 && (
                <span className="text-xs text-blue-300">
                  {f.tags.map(t => `#${t}`).join(" ")}
                </span>
              )}
              <span className="text-white/80 text-xs">{f.description}</span>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-200 underline text-xs"
                download
              >
                Télécharger
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}