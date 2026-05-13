import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye } from "react-icons/fa";

export default function Pedimento() {
  const backConection = import.meta.env.VITE_BACK_URL;

  const [data, setData] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [domicilios, setDomicilios] = useState([]);

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [domicilioSeleccionado, setDomicilioSeleccionado] = useState("");
  const [tipoPedimento, setTipoPedimento] = useState("");



  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const { cuenta, id_empresa } = userData; 


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
  // CAMBIO EMPRESA
  // =========================
  const handleEmpresaChange = (e) => {
      const empresaId = e.target.value;
      setEmpresaSeleccionada(empresaId);
      setDomicilioSeleccionado("");
      setTipoPedimento("");
      setData([]);
  };

  // =========================
  // CAMBIO DOMICILIO
  // =========================
  const handleDomicilioChange = (e) => {
    setDomicilioSeleccionado(e.target.value);
    setTipoPedimento("");
    setData([]);
  };
  // =========================
  // CAMBIO TIPO PEDIMENTO
  // =========================
  const handleTipoPedimentoChange = (e) => {
    setTipoPedimento(e.target.value);
  };


  useEffect(() => {

      // No consultar hasta tener los 3 valores
      if (
          !empresaSeleccionada ||
          !domicilioSeleccionado ||
          !tipoPedimento
      ) {
          return;
      }

      let url = `${backConection}/api/verpedimento`;

      url += `?id_empresa=${empresaSeleccionada}`;
      url += `&id_domicilio=${domicilioSeleccionado}`;
      url += `&tipo_pedimento=${tipoPedimento}`;

      fetch(url)
          .then((response) => response.json())
          .then((data) => setData(data))
          .catch((error) =>
              console.error("Error al obtener los datos:", error)
          );

  }, [
      empresaSeleccionada,
      domicilioSeleccionado,
      tipoPedimento,
      backConection
  ]);



  const handleEdit = (no_pedimento) => {
    navigate(`/pedimentos/editar/${no_pedimento}`);
  };

  const handleView = (no_pedimento) => {
    navigate(`/pedimentos/ver/${no_pedimento}`);
  };

  return (
    <div class="contenedor_prin">
      <div>
          <h1 className="text-2xl font-bold mb-4">
              Selecciona una Empresa, Domicilio y un tipo de Pedimento
          </h1>

          <div className="grid grid-cols-3 gap-4 mb-6">
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

              <div>
                  <label className="block mb-2 font-semibold">
                      Tipo de Pedimento
                  </label>

                  <select
                      value={tipoPedimento}
                      onChange={handleTipoPedimentoChange}
                      disabled={!domicilioSeleccionado}
                      className="w-full border rounded-md p-2 disabled:bg-gray-200"
                  >
                      <option value="">-- Seleccionar Tipo --</option>
                      <option value="1">Sin utilizar</option>
                      <option value="2">En uso</option>
                      <option value="3">Completados</option>
                      <option value="4">Todos</option>
                  </select>
              </div>

        
          </div>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-[#3b2f2f]">
        Pedimentos
      </h1>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "#f5e8c6" }}>
            <tr className="text-[#3b2f2f] text-left">
              <th className="p-4">Número Pedimento</th>
              <th className="p-4">Tipo Operación</th>
              <th className="p-4">Clave Pedimento</th>
              <th className="p-4">Patente</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estatus</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => {

              // =========================
              // CALCULO DE DIAS
              // =========================
              const fechaEnDate = new Date(row.fecha_en);
              const hoy = new Date();

              const diferenciaMs = hoy - fechaEnDate;

              const diasTranscurridos = Math.floor(
                diferenciaMs / (1000 * 60 * 60 * 24)
              );

              // =========================
              // ESTATUS
              // =========================
              let estatus = "";
              let badgeColor = "";

              if (diasTranscurridos > 540) {
                estatus = "Expirado";
                badgeColor = "bg-red-600 text-white";
              } else if (diasTranscurridos >= 500) {
                estatus = "Próximo a vencer";
                badgeColor = "bg-yellow-400 text-black";
              } else {
                estatus = "En tiempo";
                badgeColor = "bg-green-600 text-white";
              }

              // =========================
              // PATENTE
              // =========================
              const patente = row.no_pedimento?.substring(4, 8);

              return (
                <tr
                  key={row.no_pedimento}
                  className="border-t hover:bg-[#fff7ef] transition-all duration-200"
                >
                  {/* NUMERO PEDIMENTO */}
                  <td className="p-4 font-medium text-[#3b2f2f]">
                    {row.no_pedimento}
                  </td>

                  {/* TIPO OPERACION */}
                  <td className="p-4 text-[#5a3e2b]">
                    {row.tipo_oper}
                  </td>

                  {/* CLAVE PEDIMENTO */}
                  <td className="p-4 text-[#5a3e2b]">
                    {row.clave_ped}
                  </td>

                  {/* PATENTE */}
                  <td className="p-4 text-[#5a3e2b]">
                    {patente}
                  </td>

                  {/* FECHA */}
                  <td className="p-4 text-[#5a3e2b]">
                    {row.fecha_en}
                  </td>

                  {/* ESTATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
                    >
                      {estatus}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="p-4">
                    <div className="flex justify-center gap-4">

                      {(userData?.tipo_de_cuenta !== 3 &&
                        userData?.tipo_de_cuenta !== 4) && (
                        <button
                          className="text-[#a47148] hover:text-[#8d5a3b] transition"
                          onClick={() => handleEdit(row.no_pedimento)}
                        >
                          <FaEdit />
                        </button>
                      )}

                      <button
                        className="text-[#dc8051] hover:text-[#c96f42] transition"
                        onClick={() => handleView(row.no_pedimento)}
                      >
                        <FaEye />
                      </button>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}