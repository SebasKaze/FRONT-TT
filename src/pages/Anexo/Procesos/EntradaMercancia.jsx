import { useState, useEffect } from "react";
import { useNavigate }  from "react-router-dom";
import { FaEye } from "react-icons/fa6";

export default function Pedimento() {
    const backConection = import.meta.env.VITE_BACK_URL;

    const [data, setActivos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);

    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");

    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalOjo, setIsModalOjo] = useState(false);
    const [modalData, setModalData] = useState(null);
    
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const { cuenta, id_empresa } = userData; 

    // =========================
    // CARGAR EMPRESAS
    // =========================
    useEffect(() => {
        fetch(`${backConection}/api/infoempre`)
            .then((response) => response.json())
            .then((data) => {
                setEmpresas(data);
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

        fetch(
            `${backConection}/api/procesos/emercancias?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}`
        )
            .then((response) => response.json())
            .then((data) => setActivos(data))
            .catch((error) =>
                console.error("Error al obtener los datos:", error)
            );
    }, [empresaSeleccionada, domicilioSeleccionado, backConection]);

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

    // Función para descargar reportes con el rango de fechas seleccionado
    const descargarExcel = () => {
        if (!fechaInicio || !fechaFin) {
            alert("Por favor, selecciona un rango de fechas.");
            return;
        }
        window.open(`${backConection}/api/procesos/reporte/emercanciasE?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, "_blank");
    };

    const fetchFracciones =  (pedimento) => {
        navigate(`/pedimentos/ver/${pedimento}`);
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
                        <h2 className="text-2xl font-light text-[#3b2f2f] tracking-wide">
                            Entrada de Mercancías
                        </h2>
                        <button
                            onClick={() => setModalOpen(true)}
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
                                {data.map((row, index) => (
                                    <tr
                                        key={row.no_pedimento}
                                        className="hover:bg-[#fdfaf7] transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-[#3b2f2f] text-center">
                                            {row.no_pedimento}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            {row.clave_ped}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            {row.fecha_en}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            {row.regimen}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            {row.des_ori}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            {row.tipo_cambio}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            {row.peso_bruto}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            {row.aduana_e_s}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            ${row.valor_dolares}
                                        </td>
                                        <td className="px-4 py-3 text-[#5a4a3a] text-center">
                                            ${row.valor_aduana}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => fetchFracciones(row.no_pedimento)}
                                                className="p-2 rounded-full text-[#a47148] hover:bg-[#f5ede4] hover:text-[#7a4e2e] transition-colors"
                                            >
                                                <FaEye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {modalOjo && <Modal data={modalData} onClose={() => setIsModalOjo(false)} />}
            </div>

            {/* MODAL DE REPORTE */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-light text-[#3b2f2f] mb-4">Generar Reporte</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#5a4a3a] mb-1">
                                    Fecha Inicio
                                </label>
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    className="w-full border border-[#d9cdc0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#b2906e] focus:border-[#b2906e]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#5a4a3a] mb-1">
                                    Fecha Fin
                                </label>
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    className="w-full border border-[#d9cdc0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#b2906e] focus:border-[#b2906e]"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={descargarExcel}
                                    className="flex-1 bg-[#4a7c59] text-white py-2 rounded-md text-sm font-medium hover:bg-[#3d6448] transition-colors"
                                >
                                    Exportar Excel
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setModalOpen(false)}
                            className="mt-5 w-full border border-[#d9cdc0] text-[#5a4a3a] py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="px-6 py-4 border-b border-[#efe6dc]">
                    <h2 className="text-lg font-medium text-[#3b2f2f]">Fracciones del Pedimento</h2>
                </div>
                <div className="p-6">
                    <table className="w-full text-sm">
                        <thead className="bg-[#f7f2eb] text-[#4a3a2a]">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">Fracción</th>
                                <th className="px-4 py-2 text-left font-medium">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0e9e2]">
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 text-[#5a4a3a]">{item.fraccion}</td>
                                        <td className="px-4 py-2 text-[#5a4a3a]">{item.cantidad_umt}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-4 py-6 text-center text-gray-500">
                                        No hay partidas para este pedimento
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-[#efe6dc] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-[#5a4a3a] hover:bg-gray-50 rounded-md transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}