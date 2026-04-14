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
        subd:"",
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
                subd:"",
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
        <div className="max-w-6xl mx-auto bg-gray-100 p-5 rounded-xl">
            {mensaje && (
                <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-md">
                    {mensaje}
                </div>
            )}

            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg mb-6"
                onClick={Regresar}
            >
                <IoMdArrowRoundBack className="inline mr-2" />
                Regresar
            </button>

            <h2 className="text-lg font-bold mb-4">Nuevo Material</h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-md"
            >
                {/* EMPRESA */}
                <div>
                    <label className="block mb-2">Empresa</label>
                    <select
                        value={empresaSeleccionada}
                        onChange={handleEmpresaChange}
                        required
                        className="w-full border rounded-md p-2"
                    >
                        <option value="">Selecciona empresa</option>
                        {empresas.map((empresa) => (
                            <option
                                key={empresa.id_empresa}
                                value={empresa.id_empresa}
                            >
                                {empresa.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* DOMICILIO */}
                <div>
                    <label className="block mb-2">Domicilio</label>
                    <select
                        value={domicilioSeleccionado}
                        onChange={handleDomicilioChange}
                        required
                        disabled={!empresaSeleccionada}
                        className="w-full border rounded-md p-2 disabled:bg-gray-200"
                    >
                        <option value="">Selecciona domicilio</option>
                        {domicilios.map((domi) => (
                            <option
                                key={domi.id_domicilio}
                                value={domi.id_domicilio}
                            >
                                {domi.texto}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CAMPOS */}
                <div>
                    <label>ID</label>
                    <input
                        type="text"
                        name="idInterno"
                        value={formData.idInterno}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombreFracc"
                        value={formData.nombreFracc}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div>
                    <label>Fracción</label>
                    <input
                        type="text"
                        name="fraccion"
                        value={formData.fraccion}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div>
                    <label>Subd</label>
                    <input
                        type="text"
                        name="subd"
                        value={formData.subd}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div>
                    <label>Descripción</label>
                    <input
                        type="text"
                        name="descripcionFraccion"
                        value={formData.descripcionFraccion}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div>
                    <label>Unidad Medida</label>
                    <input
                        type="text"
                        name="unidadMedida"
                        value={formData.unidadMedida}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                    />
                </div>

                <div className="col-span-2 md:col-span-3">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                        Agregar
                    </button>
                </div>
            </form>
        </div>
    );
}