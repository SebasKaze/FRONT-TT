import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function CambioCrearActivo() {
    const navigate = useNavigate();
    const backConection = import.meta.env.VITE_BACK_URL;

    const [data, setActivos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);

    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const { id_empresa, cuenta } = userData; 

    const LimitadorBoton = cuenta === "1" || cuenta === "2" ;

    // =========================
    // CARGAR EMPRESAS
    // =========================
    useEffect(() => {
        fetch(`${backConection}/api/infoempre`)
            .then((response) => response.json())
            .then((data) => {
                setEmpresas(data);

                // Si cuenta = 2, fijar empresa automáticamente
                if (cuenta === "2" && id_empresa) {
                    setEmpresaSeleccionada(id_empresa.toString());
                }
            })
            .catch((error) =>
                console.error("Error al obtener empresas:", error)
            );
    }, [backConection, cuenta, id_empresa]);
    // =========================
    // CARGAR DOMICILIOS AL CAMBIAR EMPRESA
    // =========================
    useEffect(() => {
        if (!empresaSeleccionada) {
            setDomicilios([]);
            return;
        }

        fetch(`${backConection}/api/infodomi/${empresaSeleccionada}`)
            .then((res) => res.json())
            .then((data) => setDomicilios(data))
            .catch((error) =>
                console.error("Error al obtener domicilios:", error)
            );
    }, [empresaSeleccionada, backConection]);
    // =========================
    // CAMBIO EMPRESA
    // =========================
    const handleEmpresaChange = (e) => {
        const empresaId = e.target.value;
        setEmpresaSeleccionada(empresaId);
        setDomicilioSeleccionado("");
        setActivos([]);
    };
    // =========================
    // CAMBIO DOMICILIO
    // =========================
    const handleDomicilioChange = (e) => {
        setDomicilioSeleccionado(e.target.value);
    };


    const Regresar = () => {
        navigate("/activofijo");
    };
    const [mensaje, setMensaje] = useState("");
    const [formData, setFormData] = useState({
        idInterno: "",
        nombre_activofijo: "",
        fraccion: "",
        ubicacion_interna: "",
        descripcion: "",
        pedimentoSeleccionado: "",
    });
    const [pedimentos, setPedimentos] = useState([]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    
    const handleBuscarPedimentos = async () => {
        if (!empresaSeleccionada || !domicilioSeleccionado) {
            alert("Selecciona empresa y domicilio");
            return;
        }

        try {
            const response = await axios.get(
                `${backConection}/api/pedimentoAf/activofijo?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}`
            );

            setPedimentos(response.data);
        } catch (error) {
            console.error("Error al obtener pedimentos:", error);
        }
    };

    // Enviar datos al backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                ...formData,
                pedimento: formData.pedimentoSeleccionado, // 👈 nuevo campo limpio
                id_usuario: userData.id_usuario,
                id_empresa: empresaSeleccionada,
                id_domicilio: domicilioSeleccionado,
            };

            const response = await fetch(`${backConection}/api/cargaaf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setMensaje("Datos enviados correctamente");
            setTimeout(() => setMensaje(""), 3000);

            setFormData({
                idInterno: "",
                fraccion: "",
                nombre_activofijo: "",
                ubicacion_interna: "",
                descripcion: "",
                pedimentosSeleccionados: [],
            });
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            setMensaje("Ocurrió un error al enviar los datos");
            setTimeout(() => setMensaje(""), 3000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-gray-100 p-5 rounded-xl">
            <div>
                <button className="btn-crud" onClick={Regresar}>
                    <IoMdArrowRoundBack /> Regresar
                </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4 pt-6">Crear un Activo Fijo</h1>

            <div>
                <h1 className="text-2xl font-bold mb-4">
                    Selecciona una Empresa y Domicilio
                </h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-2 font-semibold">
                            Empresa
                        </label>
                        <select
                            value={empresaSeleccionada}
                            onChange={handleEmpresaChange}
                            disabled={cuenta === "2"}
                            className="w-full border rounded-md p-2 disabled:bg-gray-200"
                        >
                            <option value="">-- Seleccionar Empresa --</option>
                            {empresas
                                .filter((empresa) =>
                                    cuenta === "2"
                                        ? empresa.id_empresa === Number(id_empresa)
                                        : true
                                )
                                .map((empresa) => (
                                    <option
                                        key={empresa.id_empresa}
                                        value={empresa.id_empresa}
                                    >
                                        {empresa.nombre}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">
                            Domicilio
                        </label>
                        <select
                            value={domicilioSeleccionado}
                            onChange={handleDomicilioChange}
                            disabled={!empresaSeleccionada}
                            className="w-full border rounded-md p-2 disabled:bg-gray-200"
                        >
                            <option value="">-- Seleccionar Domicilio --</option>
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
                </div>
            </div>

            <button
                onClick={handleBuscarPedimentos}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-6"
            >
                Buscar pedimentos
            </button>

            <div>
                {mensaje && <p className="text-green-600 font-bold">{mensaje}</p>}
                <form className="grid grid-cols-2 md:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center text-center">
                        <label className="mb-2">ID</label>
                        <input
                            type="text"
                            name="idInterno"
                            value={formData.idInterno}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <label className="mb-2">Fracción</label>
                        <input
                            type="text"
                            name="fraccion"
                            value={formData.fraccion}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <label className="mb-2">Nombre</label>
                        <input
                            type="text"
                            name="nombre_activofijo"
                            value={formData.nombre_activofijo}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <label className="mb-2">Ubicación</label>
                        <input
                            type="text"
                            name="ubicacion_interna"
                            value={formData.ubicacion_interna}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <label className="mb-2">Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <div className="flex flex-col items-center text-left col-span-2">
                        <label className="mb-2 text-center w-full font-semibold">
                            Pedimento
                        </label>

                        <div className="w-full h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
                            {pedimentos.map((pedimento) => (
                                <label
                                    key={pedimento.no_pedimento}
                                    className="flex items-center space-x-2 mb-2 hover:bg-gray-100 p-1 rounded cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="pedimento"
                                        value={pedimento.no_pedimento}
                                        checked={
                                            formData.pedimentoSeleccionado === pedimento.no_pedimento
                                        }
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                pedimentoSeleccionado: e.target.value,
                                            }))
                                        }
                                    />
                                    <span className="text-sm">{pedimento.no_pedimento}</span>
                                </label>
                            ))}
                        </div>

                        <small className="text-gray-500 mt-1">
                            Selecciona un solo pedimento
                        </small>
                    </div>

                    <div className="flex flex-col items-center text-center p-8 col-span-1">
                        <button
                            type="submit"
                            className="btn-agregar"
                            disabled={!formData.pedimentoSeleccionado}
                        >
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CambioCrearActivo;
