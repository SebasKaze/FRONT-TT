import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";


import { useAuth } from "../context/AuthContext";


export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { user } = useAuth();

    // Cerrar menú si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (path) => {
        setMenuOpen(false);
        navigate(path);
    };
    const handleLogout = () => {
        logout();              
        setMenuOpen(false);    
        navigate("/login");    
    };
    return (
        <div className="fixed top-0 left-0 w-full z-50 shadow-md"
            style={{ backgroundColor: "#dc8051" }}
        >
            <div className="flex justify-between items-center px-8 py-3">

                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <img
                        className="w-14"
                        src="https://imgur.com/Ir9JUQq.png"
                        alt="Logo"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="text-2xl font-bold text-white tracking-wide">
                            Anexo24
                        </span>
                        <span className="text-xs text-orange-100">
                            TT2
                        </span>
                    </div>
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-2 text-white 
                        hover:bg-[#c96f42] px-4 py-2 rounded-lg
                        transition-all duration-300"
                    >
                        <FaUserCircle className="text-xl" />
                        <span className="font-medium">{user?.email || "Correo"}</span>

                        <motion.span
                            animate={{ rotate: menuOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FaChevronDown />
                        </motion.span>
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl overflow-hidden"
                                style={{ backgroundColor: "#fff7ef" }}
                            >
                                <button
                                    onClick={() => handleNavigation("/datos_generales")}
                                    className="w-full text-left px-4 py-3 
                                    text-[#3b2f2f] hover:bg-[#f5e8c6] 
                                    transition-all duration-200"
                                >
                                    Datos generales
                                </button>

                                <button
                                    onClick={() => handleNavigation("/domicilios")}
                                    className="w-full text-left px-4 py-3 
                                    text-[#3b2f2f] hover:bg-[#f5e8c6] 
                                    transition-all duration-200"
                                >
                                    Domicilio
                                </button>

                                <button
                                    onClick={() => handleNavigation("/registrar_empresa")}
                                    className="w-full text-left px-4 py-3 
                                    text-[#3b2f2f] hover:bg-[#f5e8c6] 
                                    transition-all duration-200"
                                >
                                    Registrar
                                </button>

                                <div className="border-t border-orange-200" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 
                                    text-[#b23a2f] hover:bg-[#f5e8c6] 
                                    transition-all duration-200 font-medium"
                                >
                                    Cerrar sesión
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}