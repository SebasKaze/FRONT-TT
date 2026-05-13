import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FaPlus, FaTrash, FaCheck, FaTimes, FaInfoCircle, FaArrowRight } from "react-icons/fa";

function Materiales() {
    const backConection = import.meta.env.VITE_BACK_URL;
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const { cuenta, id_empresa } = userData;

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);

    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");

    const [mostrarTabla, setMostrarTabla] = useState(false);

    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

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
                if (cuenta === "2" && id_empresa) {
                    setEmpresaSeleccionada(id_empresa.toString());
                    fetch(`${backConection}/api/infodomi/${id_empresa}`)
                        .then((res) => res.json())
                        .then((domiData) => setDomicilios(domiData))
                        .catch((err) => console.error(err));
                }
            })
            .catch((err) => console.error(err));
    }, [cuenta, id_empresa, backConection]);

    // ... (Mantén tus funciones handleEmpresaChange, handleBuscar, handleEditClick, etc. igual que las tienes)
    const handleEmpresaChange = (e) => {
        const empresaId = e.target.value;
        setEmpresaSeleccionada(empresaId);
        setDomicilioSeleccionado("");
        setMostrarTabla(false);

        if (empresaId) {
            fetch(`${backConection}/api/infodomi/${empresaId}`)
                .then((res) => res.json())
                .then((data) => setDomicilios(data))
                .catch((error) => console.error("Error al obtener domicilios:", error));
        } else {
            setDomicilios([]);
        }
    };

    const handleDomicilioChange = (e) => {
        setDomicilioSeleccionado(e.target.value);
        setMostrarTabla(false);
    };

    const handleBuscar = () => {
        if (!empresaSeleccionada || !domicilioSeleccionado) {
            alert("Debes seleccionar empresa y domicilio");
            return;
        }

        fetch(`${backConection}/api/verMateriales?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}`)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setMostrarTabla(true);
            })
            .catch((error) => console.error("Error al obtener materiales:", error));
    };

    const handleNuevoMaterial = () => navigate("/materiales_carga");
    const handleEditClick = (row) => { setEditingRowId(row.id_material_interno); setEditedData(row); };
    const handleCancelClick = () => { setEditingRowId(null); setEditedData({}); };
    const handleChange = (e, field) => { setEditedData(prev => ({ ...prev, [field]: e.target.value })); };
    
    const handleSaveClick = (id) => {
        const updatedData = { ...editedData, id_domicilio: domicilioSeleccionado, id_empresa: empresaSeleccionada };
        fetch(`${backConection}/api/editarmaterial`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        })
        .then(res => res.json())
        .then(updatedRow => {
            setData(prev => prev.map(row => row.id_material_interno === id ? updatedRow : row));
            setEditingRowId(null);
            alert("Cambios guardados");
        })
        .catch(err => alert("Error al actualizar"));
    };

    const handleDeleteClick = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este material?")) {
            fetch(`${backConection}/api/eliminarmaterial/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_material_interno: id, id_domicilio: domicilioSeleccionado }),
            })
            .then(() => {
                setData(prev => prev.filter(row => row.id_material_interno !== id));
                alert("Material eliminado");
            });
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
                                    <p className="text-sm font-medium text-blue-900">Crear todos los <strong>Materiales</strong> necesarios en <strong>Nuevo Material</strong>.</p>
                                </div>

                                <FaArrowRight className="text-gray-300 rotate-90" />

                                {/* Paso 2 */}
                                <div className="flex items-center gap-4 w-full bg-green-50 p-3 rounded-lg border border-green-100">
                                    <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                                    <p className="text-sm font-medium text-green-900">Ir a la sección de <strong>Productos</strong>, presionar el boton de <strong>Nuevo Producto</strong>y vincular los materiales creados .</p>
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
                        <label className="block text-sm font-medium text-[#5a4a3a] mb-1">Empresa</label>
                        <select
                            value={empresaSeleccionada}
                            onChange={handleEmpresaChange}
                            disabled={cuenta === "2"}
                            className="w-full appearance-none bg-white border border-[#d9cdc0] rounded-md px-4 py-2 text-[#3b2f2f] text-sm focus:outline-none focus:ring-1 focus:ring-[#b2906e] focus:border-[#b2906e] disabled:bg-gray-50 disabled:text-gray-500 transition-all">
                            <option value="">-- Seleccionar Empresa --</option>
                            {empresas
                                .filter((empresa) => cuenta === "2" ? empresa.id_empresa === Number(id_empresa) : true)
                                .map((empresa) => (
                                    <option key={empresa.id_empresa} value={empresa.id_empresa}>{empresa.nombre}</option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#5a4a3a] mb-1">Domicilio</label>
                        <select
                            value={domicilioSeleccionado}
                            onChange={handleDomicilioChange}
                            disabled={!empresaSeleccionada}
                            className="w-full appearance-none bg-white border border-[#d9cdc0] rounded-md px-4 py-2 text-[#3b2f2f] text-sm focus:outline-none focus:ring-1 focus:ring-[#b2906e] focus:border-[#b2906e] disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        >
                            <option value="">-- Seleccionar Domicilio --</option>
                            {domicilios.map((domi) => (
                                <option key={domi.id_domicilio} value={domi.id_domicilio}>{domi.texto}</option>
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
                        <h1 className="text-3xl font-light text-[#3b2f2f] tracking-wide">Materiales</h1>
                        {/* ... (Resto de tu código: Botón nuevo, selectores y tabla) ... */}
                        {LimitadorBoton && (
                            <div className="mb-4">
                                <button
                                    className="px-5 py-2 bg-[#a47148] text-white text-sm font-medium rounded-md hover:bg-[#8b5a3a] transition-colors shadow-sm"
                                    onClick={handleNuevoMaterial}
                                >
                                    Nuevo material <FaPlus className="inline ml-2" />
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
                                            <th className="px-4 py-3 text-center">Unidad</th>
                                            <th className="px-4 py-3 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((row) => (
                                            <tr key={row.id_material_interno}className="hover:bg-[#fdfaf7] transition-colors">
                                                <td className="px-4 py-3  text-[#5a4a3a] text-center">{row.id_material_interno}</td>
                                                {[
                                                    { field: 'nombre_interno', label: 'Nombre' },
                                                    { field: 'fraccion_arancelaria', label: 'Fracción' },
                                                    { field: 'subd', label: 'Subd' },
                                                    { field: 'descripcion_fraccion', label: 'Descripción' },
                                                    { field: 'unidadmedida', label: 'Unidad' }
                                                ].map((col) => (
                                                    <td key={col.field} className="px-4 py-3  text-[#5a4a3a] text-center">
                                                        {editingRowId === row.id_material_interno && col.field !== 'fraccion_arancelaria' && col.field !== 'subd' ? (
                                                            <input
                                                                className="w-full p-1 border rounded bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                                value={editedData[col.field] || ""}
                                                                onChange={(e) => handleChange(e, col.field)}
                                                            />
                                                        ) : (
                                                            <span>{row[col.field]}</span>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3  text-[#5a4a3a] text-center">
                                                    <div className="flex gap-3 justify-center items-center">
                                                        {editingRowId === row.id_material_interno ? (
                                                            <>
                                                                <button onClick={() => handleSaveClick(row.id_material_interno)} className="text-green-600 hover:text-green-800"><FaCheck size={18} /></button>
                                                                <button onClick={handleCancelClick} className="text-red-600 hover:text-red-800"><FaTimes size={18} /></button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => handleEditClick(row)} className="text-blue-600 hover:text-blue-800"><CiEdit size={22} /></button>
                                                                <button onClick={() => handleDeleteClick(row.id_material_interno)} className="text-red-500 hover:text-red-700"><FaTrash size={16} /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Materiales;