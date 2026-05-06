import { useState, useEffect } from "react";

function DatosGe() {
    const backConection = import.meta.env.VITE_BACK_URL;
    const userData = JSON.parse(localStorage.getItem("user")); // Obtener datos de usuario desde localStorage
    const [userInfo, setUserInfo] = useState(null);
    const [empresaInfo, setEmpresaInfo] = useState(null);
    

    useEffect(() => {
        if (!userData || !userData.id_usuario || !userData.id_empresa) {
            console.error("Faltan datos del usuario en localStorage");
            return;
        }

        // Petición para obtener información del usuario
        fetch(`${backConection}/api/datosGenerales/usuario`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_usuario: userData.id_usuario }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.length > 0) {
                    const usuario = {
                        nombre: data[0].nombre,
                        correo: data[0].correo, 
                        telefono: data[0].telefono,
                    };
                    setUserInfo(usuario);
                } else {
                    console.warn("No se encontró información del usuario.");
                }
            })
            .catch((error) => console.error("Error al obtener información del usuario:", error));

        // Petición para obtener información de la empresa
        fetch(`${backConection}/api/datosGenerales/empresa`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_empresa: userData.id_empresa }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.length > 0) {
                    const empresa = {
                        rfc: data[0].rfc,
                        razon_social: data[0].razon_social,
                        no_immex: data[0].no_immex,
                    };
                    setEmpresaInfo(empresa);
                } else {
                    console.warn("No se encontró información de la empresa.");
                }
            })
            .catch((error) => console.error("Error al obtener información de la empresa:", error));
    }, []);

    const handleGuardar = async () => {
        try {
            const response = await fetch(`${backConection}/api/datosGenerales/actualizarUsuario`, {
                method: "POST", // o POST dependiendo tu backend
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_usuario: userData.id_usuario,
                    nombre: userInfo.nombre,
                    telefono: userInfo.telefono,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Datos actualizados correctamente");
            } else {
                alert(data.message || "Error al actualizar");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error en la conexión");
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-gray-100 p-5 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Datos Generales</h2>

            {/* Tabla de Usuario */}
            {userInfo && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Información del Usuario</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Nombre (editable) */}
                        <div>
                            <label className="block text-sm font-medium">Nombre</label>
                            <input
                                type="text"
                                value={userInfo.nombre}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, nombre: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        {/* Correo (bloqueado) */}
                        <div>
                            <label className="block text-sm font-medium">Correo</label>
                            <input
                                type="email"
                                value={userInfo.correo}
                                disabled
                                className="w-full border p-2 rounded bg-gray-200"
                            />
                        </div>

                        {/* Teléfono (editable) */}
                        <div>
                            <label className="block text-sm font-medium">Teléfono</label>
                            <input
                                type="text"
                                value={userInfo.telefono}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, telefono: e.target.value })
                                }
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>

                    {/* Botón guardar */}
                    <button
                        onClick={handleGuardar}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        Guardar Cambios
                    </button>
                </div>
            )}

            {/* Tabla de Empresa */}
            {empresaInfo && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Información de la Empresa</h3>
                    <table className="table-auto border-collapse border border-gray-400 w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">RFC</th>
                                <th className="border px-4 py-2">Razón Social</th>
                                <th className="border px-4 py-2">No. IMMEX</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">{empresaInfo.rfc}</td>
                                <td className="border px-4 py-2">{empresaInfo.razon_social}</td>
                                <td className="border px-4 py-2">{empresaInfo.no_immex}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DatosGe;
