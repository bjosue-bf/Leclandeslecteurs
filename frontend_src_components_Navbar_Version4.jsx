import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-4 px-8 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-tight">AmazingFS</Link>
      <div className="flex gap-6">
        <Link to="/gallery" className="hover:text-blue-200">Galerie</Link>
        <Link to="/upload" className="hover:text-blue-200">Uploader</Link>
        <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
        <Link to="/admin" className="hover:text-blue-200">Admin</Link>
        <Link to="/profile" className="hover:text-blue-200">Profil</Link>
        <Link to="/login" className="hover:text-blue-200">Connexion</Link>
      </div>
    </nav>
  );
}