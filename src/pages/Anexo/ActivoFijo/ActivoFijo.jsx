import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye } from "react-icons/fa";

function ActivoFijo() {
    const backConection = import.meta.env.VITE_BACK_URL;

    const [data, setActivos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);

    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");


    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const { id_empresa, cuenta } = userData; 

    const navigate = useNavigate();
    const cambioCrearActivo = () => {
        navigate("/activofijocrear");
    }
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


    useEffect(() => {
        if (empresaSeleccionada && domicilioSeleccionado) {
            fetch(`${backConection}/api/activofijo?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}`)
                .then((response) => response.json())
                .then((data) => setActivos(data))
                .catch((error) => console.error("Error al obtener los datos:", error));
        }
    }, [empresaSeleccionada, domicilioSeleccionado]);

    return (
        <div className="max-w-6xl mx-auto bg-gray-100 p-5 rounded-xl">
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
            <h2 className="text-2xl font-bold mb-4">Activo Fijo</h2>
                <div className="w-full p-6">
                    {LimitadorBoton && (
                        <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
                        onClick={cambioCrearActivo}>
                            Agregar Activo Fijo <FaPlus className="inline ml-2"/>
                        </button>
                    )}

                </div>
            {data.length > 0 ? (
                <table className="table-auto border-collapse border border-gray-400 w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">ID Activo Fijo</th>
                            <th className="border px-4 py-2">Fracción Arancelaria</th>
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">Ubicación</th>
                            <th className="border px-4 py-2">Descripción</th>
                            <th className="border px-4 py-2">Pedimentos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((activo) => (
                            <tr key={activo.id_activo_fijo_interno}>
                                <td className="border px-4 py-2">{activo.id_activo_fijo_interno}</td>
                                <td className="border px-4 py-2">{activo.fraccion_arancelaria}</td>
                                <td className="border px-4 py-2">{activo.nombre}</td>
                                <td className="border px-4 py-2">{activo.ubi_interna}</td>
                                <td className="border px-4 py-2">{activo.descripcion}</td>
                                <td className="border px-4 py-2">
                                <button 
                                    className="text-green-500 hover:text-green-800"
                                    >
                                    <FaEye />
                                </button>
                                
                                
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No hay activos fijos registrados para esta empresa.</p>
            )}
        </div>
    );
}

export default ActivoFijo;