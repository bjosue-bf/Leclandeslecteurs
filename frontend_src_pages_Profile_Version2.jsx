import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.user) setUser(data.user);
        else navigate("/login");
      });
  }, [navigate]);

  const handleAvatar = (e) => {
    setAvatar(e.target.files[0]);
    setStatus("");
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!password) return setStatus("Mot de passe requis");
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:4000/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setStatus("Mot de passe modifié !");
    else setStatus("Erreur");
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatar) return setStatus("Choisis une image !");
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("avatar", avatar);
    const res = await fetch("http://localhost:4000/api/auth/upload-avatar", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: form,
    });
    if (res.ok) setStatus("Avatar modifié !");
    else setStatus("Erreur");
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Chargement…</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8 flex flex-col items-center">
      <div className="bg-white/10 p-8 rounded-3xl shadow-xl w-full max-w-lg flex flex-col items-center gap-6">
        <img src={user.avatar || "/default-avatar.png"} alt="avatar" className="w-28 h-28 rounded-full border-4 border-white shadow" />
        <h2 className="text-3xl font-bold text-white">{user.username}</h2>
        <div className="text-white/80">{user.email}</div>
        <form onSubmit={handleAvatarUpload} className="flex flex-col gap-2 w-full items-center">
          <label className="text-white font-semibold">Changer d’avatar</label>
          <input type="file" accept="image/*" onChange={handleAvatar} className="text-white"/>
          <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">Envoyer</button>
        </form>
        <form onSubmit={handlePassword} className="flex flex-col gap-2 w-full items-center">
          <label className="text-white font-semibold">Changer de mot de passe</label>
          <input type="password" className="p-2 rounded w-full" placeholder="Nouveau mot de passe" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">Modifier</button>
        </form>
        {status && <div className="text-white mt-2">{status}</div>}
      </div>
    </section>
  );
}