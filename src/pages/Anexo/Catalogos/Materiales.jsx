import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FaPlus, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

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

    const LimitadorBoton = cuenta === "1" || cuenta === "2";

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
        setMostrarTabla(false);
    };

    // =========================
    // BUSCAR MATERIALES
    // =========================
    const handleBuscar = () => {
        if (!empresaSeleccionada || !domicilioSeleccionado) {
            alert("Debes seleccionar empresa y domicilio");
            return;
        }

        fetch(
            `${backConection}/api/verMateriales?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioSeleccionado}`
        )
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setMostrarTabla(true);
            })
            .catch((error) =>
                console.error("Error al obtener materiales:", error)
            );
    };

    const handleNuevoMaterial = () => {
        navigate("/materiales_carga");
    };

    const handleEditClick = (row) => {
        setEditingRowId(row.id_material_interno);
        setEditedData(row);
    };

    const handleSaveClick = (id) => {
        const updatedData = {
            ...editedData,
            id_domicilio: domicilioSeleccionado,
            id_empresa: empresaSeleccionada,
        };

        fetch(`${backConection}/api/editarmaterial`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then((updatedRow) => {
                setData((prevData) =>
                    prevData.map((row) =>
                        row.id_material_interno === id ? updatedRow : row
                    )
                );
                setEditingRowId(null);
                alert("Cambios guardados exitosamente");
            })
            .catch((error) => {
                console.error("Error al actualizar:", error);
                alert("Error al actualizar");
            });
    };

    const handleCancelClick = () => {
        setEditingRowId(null);
        setEditedData({});
    };

    const handleChange = (e, field) => {
        setEditedData((prevData) => ({
            ...prevData,
            [field]: e.target.value,
        }));
    };

    const handleDeleteClick = (id) => {
        const deleteData = {
            id_material_interno: id,
            id_domicilio: domicilioSeleccionado,
        };

        if (window.confirm("¿Seguro que deseas eliminar este material?")) {
            fetch(`${backConection}/api/eliminarmaterial/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteData),
            })
                .then((response) => response.json())
                .then(() => {
                    setData((prevData) =>
                        prevData.filter(
                            (row) => row.id_material_interno !== id
                        )
                    );
                    alert("Material eliminado");
                })
                .catch((error) => {
                    console.error("Error al eliminar:", error);
                });
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-gray-100 p-5 rounded-xl">
            <h1 className="text-3xl font-bold mb-4 text-center">Materiales</h1>
            
            {/* BOTON NUEVO */}
            {LimitadorBoton && (
                <div className="mb-4">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                        onClick={handleNuevoMaterial}
                    >
                        Nuevo material <FaPlus className="inline ml-2" />
                    </button>
                </div>
            )}
            <h1 className="text-2xl font-bold mb-4">Buscar Materiales</h1>
            {/* FORMULARIO */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block mb-2 font-semibold">
                        Empresa
                    </label>
                    <select
                    value={empresaSeleccionada}
                    onChange={handleEmpresaChange}
                    disabled={cuenta === "2"}
                    className="w-full border rounded-md p-2 disabled:bg-gray-200">
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

            <button
                onClick={handleBuscar}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-6"
            >
                Buscar
            </button>

            {/* TABLA */}

            {mostrarTabla && (
                <div className="w-full p-4 overflow-x-auto">
                    <table className="w-full border border-gray-300 shadow-lg bg-white text-sm">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="p-2 border">ID/No. Parte</th>
                                <th className="p-2 border">Nombre</th>
                                <th className="p-2 border">Fracción</th>
                                <th className="p-2 border">Subd</th>
                                <th className="p-2 border">Descripción</th>
                                <th className="p-2 border">Unidad</th>
                                <th className="p-2 border">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.id_material_interno} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-2 border text-center">{row.id_material_interno}</td>
                                    
                                    {/* Renderizado Condicional de Celdas */}
                                    {[
                                        { field: 'nombre_interno', label: 'Nombre' },
                                        { field: 'fraccion_arancelaria', label: 'Fracción' }, // Este no será editable
                                        { field: 'subd', label: 'Subd' },
                                        { field: 'descripcion_fraccion', label: 'Descripción' },
                                        { field: 'unidadmedida', label: 'Unidad' }
                                    ].map((col) => (
                                        <td key={col.field} className="p-1 border">
                                            {/* CONDICIÓN: Si es la fila editando Y NO es el campo 'fraccion_arancelaria' */}
                                            {editingRowId === row.id_material_interno && col.field !== 'fraccion_arancelaria' && col.field !== 'subd' ? (
                                                <input
                                                    className="w-full p-1 border rounded bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={editedData[col.field] || ""}
                                                    onChange={(e) => handleChange(e, col.field)}
                                                />
                                            ) : (
                                                // Si no se está editando, o es el campo bloqueado, se muestra el valor original
                                                <span>{row[col.field]}</span>
                                            )}
                                        </td>
                                    ))}

                                    <td className="p-2 border text-center">
                                        <div className="flex gap-3 justify-center items-center">
                                            {editingRowId === row.id_material_interno ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleSaveClick(row.id_material_interno)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Guardar"
                                                    >
                                                        <FaCheck size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={handleCancelClick}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Cancelar"
                                                    >
                                                        <FaTimes size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEditClick(row)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Editar"
                                                    >
                                                        <CiEdit size={22} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(row.id_material_interno)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Eliminar"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
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
    );
}

export default Materiales;