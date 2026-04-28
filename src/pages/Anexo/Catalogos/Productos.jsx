import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FaPlus, FaEye } from "react-icons/fa";

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
        <div className="max-w-6xl mx-auto bg-gray-100 p-5 rounded-xl">
            <h1 className="text-3xl font-bold mb-4 text-center">Productos</h1>

            {LimitadorBoton && (
                <div className="w-full">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg" onClick={handleNuevoProducto}>
                        Nuevo producto <FaPlus className="inline ml-2" />
                    </button>
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4">Buscar Productos</h1>
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
            
            {mostrarTabla && (
                <div className="w-full p-4">
                    <table className="w-full border border-gray-300 shadow-lg bg-white">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Nombre</th>
                                <th className="border p-2">Fracción</th>
                                <th className="border p-2">Subd</th>
                                <th className="border p-2">Descripción</th>
                                <th className="border p-2">Unidad de medida</th>
                                <th className="border p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.id_producto_interno} className="text-center">
                                    <td className="border p-2">{row.id_producto_interno}</td>
                                    <td className="border p-2">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.nombre_interno || ""} onChange={(e) => handleChange(e, "nombre_interno")} className="border p-1" /> : row.nombre_interno}</td>
                                    <td className="border p-2">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.fraccion_arancelaria || ""} onChange={(e) => handleChange(e, "fraccion_arancelaria")} className="border p-1" /> : row.fraccion_arancelaria}</td>
                                    <td className="border p-2">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.subd || ""} onChange={(e) => handleChange(e, "subd")} className="border p-1" /> : row.subd}</td>
                                    <td className="border p-2">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.descripcion_fraccion || ""} onChange={(e) => handleChange(e, "descripcion_fraccion")} className="border p-1" /> : row.descripcion}</td>
                                    <td className="border p-2">{editingRowId === row.id_producto_interno ? <input type="text" value={editedData.unidad_medida || ""} onChange={(e) => handleChange(e, "unidad_medida")} className="border p-1" /> : row.id_unidad}</td>
                                    <td className="border p-2 flex justify-center gap-2">
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
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-5 rounded-md shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-3">Detalles del Producto</h2>
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">ID</th>
                                    <th className="border p-2">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popupData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border p-2 font-bold">{item.id_material_interno}</td>
                                        <td className="border p-2">{item.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button 
                            className="btn-crud" 
                            onClick={() => setShowPopup(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
            

        </div>
    );
}

export default Productos;
