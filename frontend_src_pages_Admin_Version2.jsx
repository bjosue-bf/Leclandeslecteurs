import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
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
        if (data?.user && data.user.role === "admin") {
          setUser(data.user);
          fetch("http://localhost:4000/api/admin/users", {
            headers: { Authorization: "Bearer " + token }
          })
            .then(res => res.json())
            .then(setUsers);
          fetch("http://localhost:4000/api/admin/files", {
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
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4">Administration</h2>
        <div className="mb-8">
          <h3 className="text-xl text-white font-semibold mb-2">Utilisateurs</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white/10 rounded-xl text-white">
              <thead>
                <tr>
                  <th className="p-2">Nom</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-xl text-white font-semibold mb-2">Fichiers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {files.map(f => (
              <div key={f._id} className="bg-white/10 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-lg font-semibold text-white">{f.originalname}</span>
                <span className="text-xs text-purple-200">Catégorie : {f.category}</span>
                <span className="text-xs text-blue-200">{f.tags && f.tags.map(t => `#${t}`).join(" ")}</span>
                <span className="text-white/80 text-xs">{f.description}</span>
                <span className="text-white/50 text-xs">Par {f.owner?.username || "?"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}