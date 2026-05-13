import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaPlus, FaTrash, FaCheck, FaTimes, FaInfoCircle, FaArrowRight } from "react-icons/fa";

function Productos() {
    const backConection = import.meta.env.VITE_BACK_URL;
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const { cuenta, id_empresa } = userData;


    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);

    const [popupData, setPopupData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");
    const [mostrarTabla, setMostrarTabla] = useState(false);

    // Estado para el Pop-up informativo
    const [showModal, setShowModal] = useState(false);

    const LimitadorBoton = cuenta === "1" || cuenta === "2";

    // Mostrar el modal al ingresar
    useEffect(() => {
        setShowModal(true);
    }, []);


    // =========================
    // CARGAR EMPRESAS
    // =========================
    useEffect(() => {
        fetch(`${backConection}/api/infoempre`)
            .then((response) => response.json())
            .then((data) => {
                setEmpresas(data);

                // Si la cuenta es 2, fijar empresa automáticamente
                if (cuenta === "2" && id_empresa) {
                    setEmpresaSeleccionada(id_empresa.toString());

                    // cargar domicilios automáticamente
                    fetch(`${backConection}/api/infodomi/${id_empresa}`)
                        .then((res) => res.json())
                        .then((domiData) => setDomicilios(domiData))
                        .catch((error) =>
                            console.error(
                                "Error al obtener domicilios:",
                                error
                            )
                        );
                }
            })
            .catch((error) =>
                console.error("Error al obtener empresas:", error)
            );
    }, [cuenta, id_empresa]);

    // =========================
    // CAMBIO EMPRESA
    // =========================
    const handleEmpresaChange = (e) => {
        const empresaId = e.target.value;
        setEmpresaSeleccionada(empresaId);
        setDomicilioSeleccionado("");
        setMostrarTabla(false);
        setData([]);

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

    // =========================
    // CAMBIO DOMICILIO
    // =========================
    const handleDomicilioChange = (e) => {
        setDomicilioSeleccionado(e.target.value);
        setMostrarTabla(false);
    };

    // =========================
    // BUSCAR PRODUCTOS
    // =========================
    const handleBuscar = () => {
        if (!empresaSeleccionada || !domicilioSeleccionado) {
            alert("Selecciona empresa y domicilio");
            return;
        }

        fetch(
            `${backConection}/api/verProductos?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}`
        )
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setMostrarTabla(true);
            })
            .catch((error) =>
                console.error("Error al obtener productos:", error)
            );
    };

    const handleNuevoProducto = () => {
        navigate("/productos_carga");
    };


    const handleViewClick = async (idProducto) => {
        try {
            const response = await fetch(
                `${backConection}/api/verDetalleProducto?id_producto=${idProducto}`
            );

            const data = await response.json();

            setPopupData(data);   // lo que regresa el backend
            setShowPopup(true);   // abre popup
        } catch (error) {
            console.error("Error al obtener detalle del producto:", error);
        }
    };
    return (
        <div className="min-h-screen bg-[#faf7f2] p-6 rounded-xl">
            {/* POP-UP INFORMATIVO */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-max w-full p-6 transform transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                                <FaInfoCircle /> Guía de proceso
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <p className="text-gray-600 text-sm">
                                Para garantizar la integridad de los datos, siga este orden de operación:
                            </p>
                            
                            <div className="flex flex-col items-center gap-4">
                                {/* Paso 1 */}
                                <div className="flex items-center gap-4 w-full bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                                    <p className="text-sm font-medium text-blue-900">Crear todos los <strong>Materiales</strong> necesarios en <strong>Materiales/Nuevo Material</strong>.</p>
                                </div>

                                <FaArrowRight className="text-gray-300 rotate-90" />

                                {/* Paso 2 */}
                                <div className="flex items-center gap-4 w-full bg-green-50 p-3 rounded-lg border border-green-100">
                                    <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                                    <p className="text-sm font-medium text-green-900">En <strong>Productos</strong>, presionar el boton de <strong>Nuevo Producto</strong>y vincular los materiales creados .</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                        className="w-full appearance-none bg-white border border-[#d9cdc0] rounded-md px-4 py-2 text-[#3b2f2f] text-sm focus:outline-none focus:ring-1 focus:ring-[#b2906e] focus:border-[#b2906e] disabled:bg-gray-50 disabled:text-gray-500 transition-all">
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
                <button
                    onClick={handleBuscar}
                    className="px-5 py-2 bg-[#a47148] text-white text-sm font-medium rounded-md hover:bg-[#8b5a3a] transition-colors shadow-sm"
                >
                    Buscar
                </button>
                <div className="bg-white rounded-lg border border-[#e8dfd6] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#efe6dc] flex flex-wrap items-center justify-between gap-4">
                        <h1 className="text-3xl font-light text-[#3b2f2f] tracking-wide">Productos</h1>
                        {LimitadorBoton && (
                            <div className="mb-4">
                                <button className="px-5 py-2 bg-[#a47148] text-white text-sm font-medium rounded-md hover:bg-[#8b5a3a] transition-colors shadow-sm" onClick={handleNuevoProducto}>
                                    Nuevo producto <FaPlus className="inline ml-2" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        {mostrarTabla && (
                            <div>
                                <table className="w-full text-sm">
                                    <thead className="bg-[#f7f2eb] text-[#4a3a2a] font-medium">
                                        <tr>
                                            <th className="px-4 py-3 text-center">ID/No. Parte</th>
                                            <th className="px-4 py-3 text-center">Nombre</th>
                                            <th className="px-4 py-3 text-center">Fracción</th>
                                            <th className="px-4 py-3 text-center">Subd</th>
                                            <th className="px-4 py-3 text-center">Descripción</th>
                                            <th className="px-4 py-3 text-center">Unidad de medida</th>
                                            <th className="px-4 py-3 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((row) => (
                                            <tr key={row.id_producto_interno} className="hover:bg-[#fdfaf7] transition-colors">
                                                <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.id_producto_interno}</td>
                                                <td className="px-4 py-3  text-[#5a4a3a] text-center">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.nombre_interno || ""} onChange={(e) => handleChange(e, "nombre_interno")} className="border p-1" /> : row.nombre_interno}</td>
                                                <td className="px-4 py-3  text-[#5a4a3a] text-center">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.fraccion_arancelaria || ""} onChange={(e) => handleChange(e, "fraccion_arancelaria")} className="border p-1" /> : row.fraccion_arancelaria}</td>
                                                <td className="px-4 py-3  text-[#5a4a3a] text-center">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.subd || ""} onChange={(e) => handleChange(e, "subd")} className="border p-1" /> : row.subd}</td>
                                                <td className="px-4 py-3  text-[#5a4a3a] text-center">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.descripcion_fraccion || ""} onChange={(e) => handleChange(e, "descripcion_fraccion")} className="border p-1" /> : row.descripcion}</td>
                                                <td className="px-4 py-3  text-[#5a4a3a] text-center">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.unidadmedida || ""} onChange={(e) => handleChange(e, "unidad_medida")} className="border p-1" /> : row.unidadmedida}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {editingRowId === row.id_producto_interno ? (
                                                        <>
                                                            <button className="text-green-500 hover:text-green-800" onClick={() => handleSaveClick(row.id_producto_interno)}>
                                                                ✔️
                                                            </button>
                                                            <button className="text-red-500 hover:text-red-800" onClick={handleCancelClick}>
                                                                ❌
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className="text-blue-500 hover:text-blue-800" onClick={() => handleEditClick(row)}>
                                                                <CiEdit />
                                                            </button>
                                                            <button className="text-gray-500 hover:text-gray-800" onClick={() => handleViewClick(row.id_producto)}>
                                                                <FaEye />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {showPopup && popupData && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                                <div className="bg-white p-5 rounded-md shadow-lg w-1/3">
                                    <h2 className="text-xl font-bold mb-3">Detalles del Producto</h2>
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#f7f2eb] text-[#4a3a2a] font-medium">
                                            <tr>
                                                <th className="px-4 py-3 text-center">ID/No.Parte</th>
                                                <th className="px-4 py-3 text-center">Cantidad</th>
                                                <th className="px-4 py-3 text-center">Merma</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {popupData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3  text-[#5a4a3a] text-center">{item.id_material_interno}</td>
                                                    <td className="px-4 py-3  text-[#5a4a3a] text-center">{item.cantidad}</td>
                                                    <td className="px-4 py-3  text-[#5a4a3a] text-center">{item.merma_por}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button 
                                        className="px-2 py-1 bg-[#a47148] text-white text-sm font-medium rounded-md hover:bg-[#8b5a3a] transition-colors shadow-sm"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            
            
        </div>
    );
}

export default Productos;
