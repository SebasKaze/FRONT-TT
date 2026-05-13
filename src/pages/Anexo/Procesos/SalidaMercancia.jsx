import { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa6";

function SalidaMercancia() {
    const backConection = import.meta.env.VITE_BACK_URL;
    
    const [data, setActivos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);   

    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const { cuenta, id_empresa } = userData; 
    
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

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
    // CARGAR TABLA AL SELECCIONAR DOMICILIO
    // =========================
    useEffect(() => {
            if (!empresaSeleccionada || !domicilioSeleccionado) return;
            fetch(`${backConection}/api/procesos/smercancias?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}`)
                .then((response) => response.json())
                .then((data) => setActivos(data))
                .catch((error) => console.error("Error al obtener los datos:", error));
        
    }, [empresaSeleccionada, domicilioSeleccionado]);

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



    const fetchFracciones = async (pedimento) => {
        try {
            const response = await fetch(`${backConection}/api/procesos/smercancias/fracciones?no_pedimento=${pedimento}`);
            const data = await response.json();
            setModalData(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error al obtener las fracciones:", error);
        }
    };

    const descargarExcel = () => {
        if (!fechaInicio || !fechaFin) {
            alert("Por favor, selecciona un rango de fechas.");
            return;
        }
        window.open(`${backConection}/api/procesos/reporte/smercanciasE?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, "_blank");
    };

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
                        <h2 className="text-2xl font-light text-[#3b2f2f] tracking-wide">Salida de Mercancías</h2>
                        <button 
                            onClick={() => setIsModalOpen2(true)} 
                            className="px-5 py-2 bg-[#a47148] text-white text-sm font-medium rounded-md hover:bg-[#8b5a3a] transition-colors shadow-sm"
                        >
                            Generar Reporte
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#f7f2eb] text-[#4a3a2a] font-medium">
                                <tr>
                                    <th className="px-4 py-3 text-center">Pedimento</th>
                                    <th className="px-4 py-3 text-center">Clave</th>
                                    <th className="px-4 py-3 text-center">Fecha</th>
                                    <th className="px-4 py-3 text-center">Régimen</th>
                                    <th className="px-4 py-3 text-center">Destino</th>
                                    <th className="px-4 py-3 text-center">T. Cambio</th>
                                    <th className="px-4 py-3 text-center">Peso</th>
                                    <th className="px-4 py-3 text-center">Aduana</th>
                                    <th className="px-4 py-3 text-center">Valor USD</th>
                                    <th className="px-4 py-3 text-center">Valor Aduana</th>
                                    <th className="px-4 py-3 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e9e2]">
                                {data.map((row) => (
                                    <tr key={row.no_pedimento} className="hover:bg-[#fdfaf7] transition-colors">
                                        <td className="px-4 py-3 font-medium text-[#3b2f2f] text-center">{row.no_pedimento}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.clave_ped}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.fecha_en}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.regimen}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.des_ori}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.tipo_cambio}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.peso_bruto}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.aduana_e_s}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">${row.valor_dolares}</td>
                                        <td className="px-4 py-3  text-[#5a4a3a] text-center">${row.valor_aduana}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                className="p-2 rounded-full text-[#a47148] hover:bg-[#f5ede4] hover:text-[#7a4e2e] transition-colors"
                                                onClick={() => fetchFracciones(row.no_pedimento)}
                                            >
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && <Modal data={modalData} onClose={() => setIsModalOpen(false)} />}
                </div>
            </div>


            {/* MODAL */}
            {isModalOpen2 && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Generar Reporte</h2>

                        {/* Filtro de rango de fechas */}
                        <label className="block text-gray-700">Fecha Inicio:</label>
                        <input 
                            type="date" 
                            className="border p-2 w-full mt-2 rounded" 
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />

                        <label className="block text-gray-700 mt-3">Fecha Fin:</label>
                        <input 
                            type="date" 
                            className="border p-2 w-full mt-2 rounded" 
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                        />

                        {/* Botones de exportación */}
                        <div className="flex gap-4 mt-4">
                            <button 
                                onClick={descargarExcel} 
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition">
                                Exportar Excel
                            </button>
                        </div>

                        {/* Botón para cerrar */}
                        <button 
                            onClick={() => setIsModalOpen2(false)} 
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition w-full"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Modal({ data, onClose }) {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Fracciones del Pedimento</h2>
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Fracción</th>
                            <th className="border p-2">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{item.fraccion}</td>
                                    <td className="border p-2">{item.cantidad_umt}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="border p-2 text-center">No hay partidas para este pedimento</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button 
                    className="btn-crud"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}

export default SalidaMercancia;