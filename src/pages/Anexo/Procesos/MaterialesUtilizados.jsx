import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { FaPlus, FaEye } from 'react-icons/fa';

function MaterialesUtilizados() {
    const navigate = useNavigate();
    
    const backConection = import.meta.env.VITE_BACK_URL;

    const [data, setData] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);

    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");
    

    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const { id_empresa, cuenta } = userData; 

    const [modalOjo, setIsModalOjo] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalReporte, setIsModalReporte] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
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

    useEffect(() => {
        if (empresaSeleccionada && domicilioSeleccionado) {
            fetch(`${backConection}/api/procesos/mateutili?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}`)
                .then((response) => response.json())
                .then((data) => {
                    const formattedData = data.map(row => ({
                        ...row,
                        fecha_transformacion: new Date(row.fecha_transformacion).toISOString().split('T')[0]
                    }));
                    setData(formattedData);
                })
                .catch((error) => console.error("Error al obtener los datos:", error));
        }
    }, [empresaSeleccionada, domicilioSeleccionado]);

    // =========================
    // CAMBIO EMPRESA
    // =========================
    const handleEmpresaChange = (e) => {
        const empresaId = e.target.value;
        setEmpresaSeleccionada(empresaId);
        setDomicilioSeleccionado("");
        setData([]);
    };

    // =========================
    // CAMBIO DOMICILIO
    // =========================
    const handleDomicilioChange = (e) => {
        setDomicilioSeleccionado(e.target.value);
    };


    const materialUtilizadoVer = async (id_transformacion) => {
        try {
            const response = await fetch(`${backConection}/api/procesos/mateutili/vermateuti?id_transformacion=${id_transformacion}`);
            const data = await response.json();
            setModalData(data);
            setIsModalOjo(true);
        } catch (error) {
            console.error("Error al obtener las fracciones:", error);
        }
    };

    const handleNuevoMaterial = () => {
        navigate("/materiales_utilizadoscp");
    };

    const handleEdit = (id) => {
        navigate(`/materiales-utilizados/editar/${id}`);
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    
    const descargarExcel = () => {
        if (!fechaInicio || !fechaFin) {
            alert("Por favor, selecciona un rango de fechas.");
            return;
        }
        window.open(`${backConection}/api/procesos/reporte/materialUE?id_empresa=${id_empresa}&id_domicilio=${id_domicilio}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, "_blank");
    };


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

            <div className="w-full mb-4">
                {LimitadorBoton &&(
                    <button 
                        className="btn-crud mr-4" 
                        onClick={handleNuevoMaterial}>
                        Carga de Productos <FaPlus />
                    </button>
                )}

                <button
                    onClick={() => setIsModalReporte(true)} 
                    className="px-4 py-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
                    Generar Reporte
                </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 p-6">Materiales Utilizados</h2>
            <div className="border border-gray-300 shadow-lg bg-white">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Producto</th>
                            <th className="border p-2">Cantidad creada</th>
                            <th className="border p-2">Fecha</th>
                            <th className="border p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">{row.nombre}</td>
                                <td className="border p-2">{row.cantidad}</td>
                                <td className="border p-2">{row.fecha_transformacion}</td>
                                <td className="border p-2 flex justify-center gap-2">
                                    <button className="text-blue-500 hover:text-blue-800"
                                    onClick={() => materialUtilizadoVer(row.id_transformacion)}>
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {modalOjo && <Modal data={modalData} onClose={() => setIsModalOjo(false)} />}
            </div>
            <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`px-4 py-2 rounded-md shadow-md transition-all duration-300 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            {/* MODAL */}
            {modalReporte && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
                            onClick={() => setIsModalReporte(false)} 
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
                <h2 className="text-xl font-bold mb-4">Materiales</h2>
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Material</th>
                            <th className="border p-2">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{item.nombre_interno}</td>
                                    <td className="border p-2">{item.cantidad}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="border p-2 text-center">No hay materiales</td>
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

export default MaterialesUtilizados;

