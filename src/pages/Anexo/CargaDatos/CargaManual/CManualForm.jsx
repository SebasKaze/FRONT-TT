import { useState, useEffect } from "react";

import Section1 from "./CManualFormSec/Seccion1";
import Section2 from "./CManualFormSec/Seccion2";
import Section3 from "./CManualFormSec/Seccion3";
import Section4 from "./CManualFormSec/Seccion4";
import Section5 from "./CManualFormSec/Seccion5";
import Section6 from "./CManualFormSec/Seccion6";
import Section7 from "./CManualFormSec/Seccion7";

function CargaManual() {
    const backConection = import.meta.env.VITE_BACK_URL;
    const [activeTab, setActiveTab] = useState("section1");
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const { cuenta, id_empresa } = userData;
    const [data, setData] = useState([]);

    const [empresas, setEmpresas] = useState([]);
    const [domicilios, setDomicilios] = useState([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");




    const [formData, setFormData] = useState({
        seccion1: {},
        seccion2: {},
        seccion3: {},
        seccion4: {},
        seccion5: {},
        seccion6: {},
        seccion7: [],
    });

    const [sections, setSections] = useState([]);
    const [sections2, setSections2] = useState([]);
    
    const tabs = [
        { id: "section1", name: "Encabezado P.P" },
        { id: "section2", name: "Encabezado S.P" },
        { id: "section3", name: "Datos P. o C." },
        { id: "section4", name: "Datos D." },
        { id: "section5", name: "Datos T. y T." },
        { id: "section6", name: "Candados" },
        { id: "section7", name: "Partidas" }
    ];

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


    const handleTabClick = (tab) => {
        if (tabs.some(t => t.id === tab)) {
            setActiveTab(tab);
        }
    };

    const handleNext = () => {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
        }
    };

    const handlePrev = () => {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1].id);
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                id_usuario: userData.id_usuario,
                id_empresa: empresaSeleccionada,
                nombre_usuario: userData.nombre_usuario,
                id_domicilio: domicilioSeleccionado,
                ...formData,
                contribuciones: sections,
                CuadroLiquidacion: sections2,
            };
            const response = await fetch(`${backConection}/api/cmpedimento`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                throw new Error("Error al enviar los datos");
            }
            
            alert("Datos enviados exitosamente");
            
            // Opción 1: Resetear todos los estados y volver a la primera sección
            setFormData({
                seccion1: {},
                seccion2: {},
                seccion3: {},
                seccion4: {},
                seccion5: {},
                seccion6: {},
                seccion7: [],
            });
            setSections([]);
            setSections2([]);
            setActiveTab("section1");
            
            // Opción 2: Recargar la página completamente
            // window.location.reload();
            
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al enviar los datos");
        }
    };

    const isLastTab = activeTab === tabs[tabs.length - 1].id;
    const isFirstTab = activeTab === tabs[0].id;




    // =========================
    // CAMBIO EMPRESA
    // =========================
    const handleEmpresaChange = (e) => {
        const empresaId = e.target.value;
        setEmpresaSeleccionada(empresaId);
        setDomicilioSeleccionado("");
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
    };
    return (
        <div className="max-w-6xl mx-auto bg-gray-100 p-5 rounded-xl">
            <div>
                <h1 className="text-2xl font-bold mb-4">Selecciona una Empresa y Domicilio</h1>
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
            </div>
            <div>
                <h1>Campos obligatorios:<span className="text-red-600">(*)</span></h1>
            </div>
            <div className="tabs flex justify-center space-x-4 border-b-2 pb-2 ">
                {tabs.map(({ id, name }) => (
                    <div
                        key={id}
                        className={`tab cursor-pointer px-4 py-2 ${
                            activeTab === id ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
                        }`}
                        onClick={() => handleTabClick(id)}>
                        {name}
                    </div>
                ))}
            </div>

            <div className="tab-content mt-4" style={{ display: "block" }}>
                {activeTab === "section1" && (
                    <Section1 
                        formData={formData}
                        setFormData={setFormData} 
                        sections={sections} 
                        setSections={setSections} 
                        sections2={sections2}
                        setSections2={setSections2}
                    />
                )}
                {activeTab === "section2" && <Section2 formData={formData} setFormData={setFormData}/>}
                {activeTab === "section3" && <Section3 formData={formData} setFormData={setFormData}/>}
                {activeTab === "section4" && <Section4 formData={formData} setFormData={setFormData}/>}
                {activeTab === "section5" && <Section5 formData={formData} setFormData={setFormData}/>}
                {activeTab === "section6" && <Section6 formData={formData} setFormData={setFormData}/>}
                {activeTab === "section7" && <Section7 formData={formData} setFormData={setFormData}/>}
            </div>

            <div className="flex justify-center mt-8 space-x-4">
                {!isFirstTab && (
                    <button
                        onClick={handlePrev}
                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium shadow-md hover:bg-gray-400 hover:shadow-lg transform hover:scale-105 transition duration-200">
                        Anterior
                    </button>
                )}

                {!isLastTab ? (
                    <button
                        onClick={handleNext}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                        Siguiente
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-green-500 text-white rounded-lg font-bold text-lg shadow-md hover:bg-teal-600 hover:shadow-lg transform hover:scale-105 transition duration-200">
                        Enviar Datos
                    </button>
                )}
            </div>

        </div>
    );
}

export default CargaManual;