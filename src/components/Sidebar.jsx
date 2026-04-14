import { useEffect, useState } from "react";
import {
FaHome, FaBox, FaUpload, FaCogs,
FaWarehouse, FaChartLine,
FaChevronDown, FaChevronRight
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Sidebar() {
    const [activeItem, setActiveItem] = useState("");
    const [subMenuOpen, setSubMenuOpen] = useState({});
    const location = useLocation();

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location]);

    const toggleSubMenu = (menu) => {
        setSubMenuOpen(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const menus = [
        {
            title: "Dashboard",
            route: "/dashboard",
            icon: <FaHome />
        },
        {
            title: "Pedimentos",
            route: "/pedimento",
            icon: <FaBox />
        },
        {
            title: "Carga de datos",
            icon: <FaUpload />,
            items: [
                { name: "Carga manual", route: "/carga_manual" },
                { name: "Carga documentos", route: "/cargadocumentos" },
            ]
        },
        {
            title: "Procesos",
            icon: <FaCogs />,
            items: [
                { name: "Entrada de Mercancías", route: "/entrada_mercancia" },
                { name: "Salida de Mercancías", route: "/salida_mercancia" },
                { name: "Saldos", route: "/saldo" },
                { name: "Materiales utilizados", route: "/materiales_utilizados" },
            ]
        },
        {
            title: "Activo Fijo",
            route: "/activofijo",
            icon: <FaWarehouse />
        },
        {
            title: "Catálogos",
            icon: <FaChartLine />,
            items: [
                { name: "Materiales", route: "/materiales" },
                { name: "Productos", route: "/productos" },
            ]
        }
    ];

return (
    <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 fixed top-0 left-0 z-10 shadow-xl mt-20 flex flex-col"
        style={{ 
            height: "calc(100vh - 5rem)",
            backgroundColor: "#f5e8c6"
        }}
    >
        {/* Header */}
        <div className="mb-6 p-6">
            <h1 className="text-[#3b2f2f] font-semibold text-xl tracking-wide">
                Menú
            </h1>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto">
            <ul className="px-4">
                {menus.map((menu, index) => (
                    <li key={index} className="mb-2">
                        {menu.route ? (
                            <Link
                                to={menu.route}
                                className={`flex items-center p-3 rounded-lg transition-all duration-300
                                ${activeItem === menu.route
                                    ? "bg-[#a47148] text-white shadow-md"
                                    : "text-[#5a3e2b] hover:bg-[#e6d5b8]"
                                }`}
                            >
                                <span className="mr-3 text-lg">
                                    {menu.icon}
                                </span>
                                {menu.title}
                            </Link>
                        ) : (
                            <>
                                {/* Parent menu */}
                                <div
                                    onClick={() => toggleSubMenu(menu.title)}
                                    className="flex items-center p-3 rounded-lg cursor-pointer 
                                    text-[#5a3e2b] hover:bg-[#e6d5b8] transition-all duration-300"
                                >
                                    <span className="mr-3 text-lg">
                                        {menu.icon}
                                    </span>

                                    {menu.title}

                                    <motion.span 
                                        animate={{ rotate: subMenuOpen[menu.title] ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="ml-auto"
                                    >
                                        <FaChevronDown />
                                    </motion.span>
                                </div>

                                {/* Submenu */}
                                <AnimatePresence>
                                    {subMenuOpen[menu.title] && (
                                        <motion.ul
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.25 }}
                                            className="pl-8 mt-1"
                                        >
                                            {menu.items.map((item, i) => (
                                                <li key={i}>
                                                    <Link
                                                        to={item.route}
                                                        className={`block p-2 text-sm rounded-md transition-all duration-300
                                                        ${activeItem === item.route
                                                            ? "bg-[#8d5a3b] text-white"
                                                            : "text-[#5a3e2b] hover:bg-[#e6d5b8]"
                                                        }`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    </motion.div>
);
}

export default Sidebar;