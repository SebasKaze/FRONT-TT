import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaPlus, FaTrash } from 'react-icons/fa'; 

function ProductosCarga() {
    const backConection = import.meta.env.VITE_BACK_URL;
    const navigate = useNavigate();

    const [materiales, setMateriales] = useState([]); 
    const [seleccionados, setSeleccionados] = useState([]); // Ahora es un array
    const userData = JSON.parse(localStorage.getItem("user")) || {};//Informacion del token

    const { id_empresa } = userData; // Extraer los IDs necesarios

    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");




    const [formData, setFormData] = useState({
        id: "",
        nombre: "",
        fraccion: "",
        subd:"",
        descripcion: "",
        unidadMedida: "",
        cantidad: "",
        id_empresa: "",
        id_domicilio: ""
    });

    useEffect(() => {
        fetch(`${backConection}/api/infoempre`)
            .then((response) => response.json())
            .then((data) => setEmpresas(data))
            .catch((error) =>
                console.error("Error al obtener empresas:", error)
            );
    }, []);

    const handleEmpresaChange = (e) => {
        const empresaId = e.target.value;

        setEmpresaSeleccionada(empresaId);
        setDomicilioSeleccionado("");
        setDomicilios([]);
        setMateriales([]);
        setSeleccionados([]);

        if (empresaId) {
            fetch(`${backConection}/api/infodomi/${empresaId}`)
                .then((res) => res.json())
                .then((data) => setDomicilios(data))
                .catch((error) =>
                    console.error("Error al obtener domicilios:", error)
                );
        }
    };


    const handleDomicilioChange = (e) => {
        const domicilioId = e.target.value;
        setDomicilioSeleccionado(domicilioId);
        setSeleccionados([]);

        if (empresaSeleccionada && domicilioId) {
            fetch(
                `${backConection}/api/verMateriales?id_empresa=${empresaSeleccionada}&id_domicilio=${domicilioId}`
            )
                .then((response) => response.json())
                .then((data) => setMateriales(data))
                .catch((error) =>
                    console.error("Error al obtener materiales:", error)
                );
        }
    };


    const agregarMaterial = (material) => {
        if (!seleccionados.some((m) => m.id_material_interno === material.id_material_interno)) {
            setSeleccionados([...seleccionados, { ...material, cantidad: 1 }]);
        }
    };

    const cambiarCantidad = (id, cantidad) => {
        setSeleccionados([...seleccionados, { 
            ...material, 
            cantidad: 1,
            merma: 0
        }]);
    };
    const cambiarMerma = (id, merma) => {
        setSeleccionados(seleccionados.map((m) =>
            m.id_material_interno === id
                ? { ...m, merma: parseFloat(merma) || 0 }
                : m
        ));
    };

    const eliminarMaterial = (id) => {
        setSeleccionados(seleccionados.filter((m) => m.id_material_interno !== id));
    };

    const enviarProductos = () => {
        if (!empresaSeleccionada || !domicilioSeleccionado) {
            alert("Selecciona empresa y domicilio");
            return;
        }

        const dataEnviar = {
            ...formData,
            materiales: seleccionados, 
            id_usuario: userData.id_usuario,
            id_empresa: empresaSeleccionada,
            id_domicilio: domicilioSeleccionado,
        };

        axios.post(`${backConection}/api/cargaproducto`, dataEnviar)
            .then(response => {
                console.log("Enviado con éxito:", response.data);
                alert("Productos enviados correctamente");

                setFormData({
                    id: "",
                    nombre: "",
                    fraccion: "",
                    subd:"",
                    descripcion: "",
                    unidadMedida: "",
                    cantidad: "",
                });

                setSeleccionados([]);
            })
            .catch(error => console.error("Error al enviar:", error));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [filtro, setFiltro] = useState("");
    const materialesFiltrados = materiales.filter((material) =>
        (material.nombre_interno.toLowerCase() || "").includes(filtro.toLowerCase()) || 
        (material.descripcion_fraccion.toLowerCase() || "").includes(filtro.toLowerCase())
    );

    return (
        <div className="main-container">
            <div className="w-full">
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                    onClick={() => navigate("/productos")}
                >
                    <IoMdArrowRoundBack /> Regresar
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 p-6">   
                <div className="w-full md:w-1/2 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-2 font-semibold">
                                Empresa
                            </label>
                            <select
                                value={empresaSeleccionada}
                                onChange={handleEmpresaChange}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">-- Seleccionar Empresa --</option>
                                {empresas.map((empresa) => (
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
                    <h2 className="text-lg font-bold mb-4">Datos del Producto</h2>
                    <form>
                        {[
                            { label: "ID", name: "id" },
                            { label: "Nombre", name: "nombre" },
                            { label: "Fracción", name: "fraccion" },
                            { label: "Subd", name: "subd" },
                            { label: "Descripción", name: "descripcion" },
                            { label: "Unidad Medida", name: "unidadMedida" },
                            { label: "Cantidad", name: "cantidad" }
                        ].map((campo, index) => (
                            <div key={index} className="flex flex-col mb-4">
                                <label className="mb-1">{campo.label}</label>
                                <input
                                    type="text"
                                    name={campo.name}
                                    value={formData[campo.name]}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-green-300"
                                />
                            </div>
                        ))}
                    </form>
                </div>
                
                <div className="w-full md:w-1/2 border p-4 rounded-md shadow-md">
                    <h2 className="text-lg font-bold mb-4">Lista de Materiales</h2>
                    <input
                        type="text"
                        placeholder="Buscar material..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <div className="max-h-60 overflow-auto border rounded-md p-2">
                    {materialesFiltrados.length > 0 ? (
                        materialesFiltrados.map((material) => (
                            <div key={material.id_material_interno} className="flex justify-between items-center p-2 border-b">
                                <span>{material.nombre_interno} | {material.descripcion_fraccion}</span>
                                <button
                                    onClick={() => agregarMaterial(material)}
                                    className="btn-agregar"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No se encontraron materiales</p>
                    )}
                    </div>

                    {seleccionados.length > 0 && (
                        <>
                            <h3 className="text-md font-bold mt-4">Materiales Seleccionados</h3>
                            <table className="w-full border-collapse border border-gray-300 mt-2">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Nombre</th>
                                        <th className="border p-2">Cantidad</th>
                                        <th className="border p-2">% Merma</th>
                                        <th className="border p-2">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {seleccionados.map((material) => (
                                        <tr key={material.id_material_interno} className="text-center">
                                            <td className="border p-2">{material.nombre_interno}</td>
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    value={material.cantidad}
                                                    onChange={(e) => cambiarCantidad(material.id_material_interno, e.target.value)}
                                                    className="w-16 border rounded-md p-1 text-center"
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    value={material.merma}
                                                    onChange={(e) => cambiarMerma(material.id_material_interno, e.target.value)}
                                                    className="w-16 border rounded-md p-1 text-center"
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <button
                                                    onClick={() => eliminarMaterial(material.id_material_interno)}
                                                    className="btn-eliminar"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                        onClick={enviarProductos}
                    >
                        Enviar Productos
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductosCarga;
