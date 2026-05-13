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
        <div className="min-h-screen bg-[#faf7f2] p-6 rounded-xl">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-light text-[#3b2f2f] mb-8 tracking-wide border-b border-[#e2d5ca] pb-2">
                    Selecciona una Empresa y Domicilio
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-[#5a4a3a] mb-1">
                            Empresa
                        </label>
                        <select
                            value={empresaSeleccionada}
                            onChange={handleEmpresaChange}
                            disabled={cuenta === "2"}
                            className="w-full appearance-none bg-white border border-[#d9cdc0] rounded-md px-4 py-2 text-[#3b2f2f] text-sm focus:outline-none focus:ring-1 focus:ring-[#b2906e] focus:border-[#b2906e] disabled:bg-gray-50 disabled:text-gray-500 transition-all"
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
                        <label className="block text-sm font-medium text-[#5a4a3a] mb-1">
                            Domicilio
                        </label>
                        <select
                            value={domicilioSeleccionado}
                            onChange={handleDomicilioChange}
                            disabled={!empresaSeleccionada}
                            className="w-full appearance-none bg-white border border-[#d9cdc0] rounded-md px-4 py-2 text-[#3b2f2f] text-sm focus:outline-none focus:ring-1 focus:ring-[#b2906e] focus:border-[#b2906e] disabled:bg-gray-50 disabled:text-gray-500 transition-all"
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

                <div className="bg-white rounded-lg border border-[#e8dfd6] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#efe6dc] flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-2xl font-light text-[#3b2f2f] tracking-wide">Activo Fijo</h2>
                        {LimitadorBoton && (
                            <button 
                            className="px-5 py-2 bg-[#a47148] text-white text-sm font-medium rounded-md hover:bg-[#8b5a3a] transition-colors shadow-sm"
                            onClick={cambioCrearActivo}>
                                Agregar Activo Fijo <FaPlus className="inline ml-2"/>
                            </button>
                        )}
                    </div>

                    {data.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead className="bg-[#f7f2eb] text-[#4a3a2a] font-medium">
                                <tr>
                                    <th className="px-4 py-3 text-center">ID Activo Fijo</th>
                                    <th className="px-4 py-3 text-center">Fracción Arancelaria</th>
                                    <th className="px-4 py-3 text-center">Nombre</th>
                                    <th className="px-4 py-3 text-center">Ubicación</th>
                                    <th className="px-4 py-3 text-center">Descripción</th>
                                    <th className="px-4 py-3 text-center">Pedimentos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e9e2]">
                                {data.map((activo) => (
                                    <tr key={activo.id_activo_fijo_interno} className="hover:bg-[#fdfaf7] transition-colors">
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{activo.id_activo_fijo_interno}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{activo.fraccion_arancelaria}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{activo.nombre}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{activo.ubi_interna}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{activo.descripcion}</td>
                                        <td className="px-4 py-3 text-center">
                                        <button 
                                            className="p-2 rounded-full text-[#a47148] hover:bg-[#f5ede4] hover:text-[#7a4e2e] transition-colors"
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

            </div>

        </div>
    );
}

export default ActivoFijo;