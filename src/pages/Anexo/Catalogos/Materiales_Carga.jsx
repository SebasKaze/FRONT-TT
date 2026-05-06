import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function CargaMateriales() {
    const backConection = import.meta.env.VITE_BACK_URL;
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem("user")) || {};

    const [mensaje, setMensaje] = useState("");
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);
    const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

    // =========================
    // SELECTS DESCENDIENTES
    // =========================
    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);

    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");

    const [formData, setFormData] = useState({
        idInterno: "",
        nombreFracc: "",
        fraccion: "",
        subd: "",
        descripcionFraccion: "",
        unidadMedida: "",
    });

    // =========================
    // CARGAR EMPRESAS
    // =========================
    useEffect(() => {
        fetch(`${backConection}/api/infoempre`)
            .then((response) => response.json())
            .then((data) => setEmpresas(data))
            .catch((error) =>
                console.error("Error al obtener empresas:", error)
            );
    }, []);

    // =========================
    // CAMBIO EMPRESA
    // =========================
    const handleEmpresaChange = (e) => {
        const empresaId = e.target.value;
        setEmpresaSeleccionada(empresaId);
        setDomicilioSeleccionado("");

        if (empresaId) {
            fetch(`${backConection}/api/infodomi/${empresaId}`)
                .then((res) => res.json())
                .then((data) => setDomicilios(data))
                .catch((error) =>
                    console.error("Error al obtener domicilios:", error)
                );
        } else {
            setDomicilios([]);
        }
    };

    const handleDomicilioChange = (e) => {
        setDomicilioSeleccionado(e.target.value);
    };

    // =========================
    // INPUTS
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // =========================
    // ENVIAR
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!empresaSeleccionada || !domicilioSeleccionado) {
            setMensaje("Debes seleccionar empresa y domicilio");
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                id_usuario: userData.id_usuario,
                id_empresa: empresaSeleccionada,
                id_domicilio: domicilioSeleccionado,
            };

            const response = await fetch(
                `${backConection}/api/cargamateriales`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            setMensaje("Datos enviados correctamente");

            setFormData({
                idInterno: "",
                nombreFracc: "",
                fraccion: "",
                subd: "",
                descripcionFraccion: "",
                unidadMedida: "",
            });

            setEmpresaSeleccionada("");
            setDomicilioSeleccionado("");
            setDomicilios([]);

            setTimeout(() => setMensaje(""), 3000);
        } catch (error) {
            console.error("Error al enviar:", error);
            setMensaje("Ocurrió un error al enviar los datos");
            setTimeout(() => setMensaje(""), 3000);
        }
    };

    const Regresar = () => {
        navigate("/materiales");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
            {/* Mensaje flotante */}
            {mensaje && (
                <div className="fixed top-6 right-6 z-50 animate-pulse bg-white border-l-4 border-green-500 shadow-lg rounded-lg p-4 flex items-center gap-3 transition-all duration-300">
                    <span className="text-green-600 text-sm font-medium">{mensaje}</span>
                    <button
                        onClick={() => setMensaje("")}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Botón regresar */}
            <button
                className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200 mb-6"
                onClick={Regresar}
            >
                <IoMdArrowRoundBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                Regresar
            </button>

            {/* Tarjeta principal */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Nuevo Material</h2>
                    <p className="text-blue-100 text-sm mt-1">Complete los detalles del material a cargar</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Empresa */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Empresa</label>
                            <select
                                value={empresaSeleccionada}
                                onChange={handleEmpresaChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">Selecciona empresa</option>
                                {empresas.map((empresa) => (
                                    <option key={empresa.id_empresa} value={empresa.id_empresa}>
                                        {empresa.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Domicilio */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Domicilio</label>
                            <select
                                value={domicilioSeleccionado}
                                onChange={handleDomicilioChange}
                                required
                                disabled={!empresaSeleccionada}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                            >
                                <option value="">Selecciona domicilio</option>
                                {domicilios.map((domi) => (
                                    <option key={domi.id_domicilio} value={domi.id_domicilio}>
                                        {domi.texto}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ID Interno */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">ID Interno</label>
                            <input
                                type="text"
                                name="idInterno"
                                value={formData.idInterno}
                                onChange={handleChange}
                                placeholder="Ej: MAT-001"
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Nombre */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="nombreFracc"
                                value={formData.nombreFracc}
                                onChange={handleChange}
                                placeholder="Nombre del material"
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Fracción */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Fracción</label>
                            <input
                                type="text"
                                name="fraccion"
                                value={formData.fraccion}
                                onChange={handleChange}
                                placeholder="Fracción"
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Subd */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Subd</label>
                            <input
                                type="text"
                                name="subd"
                                value={formData.subd}
                                onChange={handleChange}
                                placeholder="Subd"
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Descripción */}
                        <div className="space-y-1 lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                            <input
                                type="text"
                                name="descripcionFraccion"
                                value={formData.descripcionFraccion}
                                onChange={handleChange}
                                placeholder="Descripción detallada"
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Unidad Medida (select) */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700">Unidad Medida</label>
                            <select
                                name="unidadMedida"
                                value={formData.unidadMedida}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">Seleccione unidad</option>
                                <option value="KG">Kilogramos (KG)</option>
                                <option value="LT">Litros (LT)</option>
                                <option value="PZ">Piezas (PZ)</option>
                            </select>
                        </div>
                    </div>

                    {/* Botón enviar */}
                    <div className="mt-8 flex justify-center">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
                        >
                            + Agregar Material
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}