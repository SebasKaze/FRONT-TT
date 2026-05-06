import React, { useState } from "react";
import "../../../../cargaPDF.css"; 

function UploadPedimento() {
  const [file, setFile] = useState(null);
  const [encabezado, setEncabezado] = useState(null);
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const [tasa, setTasa] = useState([]);
  const [cuad, setCuad] = useState([]);
  const [encsec, setEncsec] = useState([]);
  const [datosPC, setDatosPC] = useState([]);
  const [datosD, setDatosD] = useState([]);
  const [datosTT, setDatosTT] = useState([]);
  const [candados, setCandados] = useState([]);
  const [contributions, setContributions] = useState([]);





  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setEncabezado(null);
    setPartidas([]);
    setError("");
  };
  const handleUpload = async () => {
    if (!file) {
      setError("Selecciona un archivo PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3000/api/procesar_pedimento", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al procesar");
      }

      setEncabezado(result.data.pedimento_encabezado);
      
      setPartidas(result.data.partidas.map(p => ({
        ...p,
        contributions: []   // o si el PDF ya trae algo, usa p.contributions || []
      })));

      setCandados(result.data.candados || []);
      setTasa(result.data.tasa || []);
      setCuad(result.data.cuad || []);
      setEncsec(result.data.encsec || []);
      setDatosPC(result.data.datosPC || []);
      setDatosD(result.data.datosD || []);
      setDatosTT(result.data.datosTT || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEncabezadoChange = (key, value) => {
    setEncabezado({
      ...encabezado,
      [key]: value,
    });
  };
  const handlePartidaChange = (index, key, value) => {
    const nuevasPartidas = [...partidas];
    nuevasPartidas[index][key] = value;
    setPartidas(nuevasPartidas);
  };
  const handleSubmit = async () => {
    const payload = {
      encabezado,
      partidas,
      tasa,
      cuad,
      encsec,
      datosPC,
      datosD,
      datosTT,
      candados, // 👈 Ahora también enviamos los candados
    };

    await fetch("http://localhost:3000/api/cargarpedimentoPDF", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };


  //TASA A NIVEL DE PEDIMENTO
  const handleTasaChange = (index, key, value) => {
    const nuevosTasas = [...tasa];
    nuevosTasas[index][key] = value;
    setTasa(nuevosTasas);
  };
  const agregarTasa = () => {
    setTasa([
      ...tasa,
      { contri: "", clvtasa: "", tasa: "" },
    ]);
  };
  const eliminarTasa = (index) => {
    setTasa(tasa.filter((_, i) => i !== index));
  };
  //CUADRO DE LIQUIDACION
  const handleCuadChange = (index, key, value) => {
    const nuevosCuad = [...cuad];
    nuevosCuad[index][key] = value;
    setCuad(nuevosCuad);
  };
  const agregarCuad = () => {
    setCuad([
      ...cuad,
      { concept: "", pago: "", importe: "" },
    ]);
  };
  const eliminarCuad = (index) => {
    setCuad(cuad.filter((_, i) => i !== index));
  };
  //ENCABEZADO SECUNDARIO
  const handleEncSecChange = (index, key, value) => {
    const nuevosSec = [...encsec];
    nuevosSec[index][key] = value;
    setEncsec(nuevosSec);
  };
  const agregarEncSec = () => {
    setEncsec([
      ...encsec,
      { rfc_i_e: "", curp_i_e: ""},
    ]);
  };
  const eliminarEncSec = (index) => {
    setEncsec(encsec.filter((_, i) => i !== index));
  };
  //DATOS PROVEEDOR COMPRADOR
  const handleDatosPCChange = (index, key, value) => {
    const nuevosDatosPC = [...datosPC];
    nuevosDatosPC[index][key] = value;
    setDatosPC(nuevosDatosPC);
  };
  const agregarDatosPC = () => {
    setDatosPC([
      ...datosPC,
      { id_fiscal: "", nom_prov: "", dom_prov: "", vinc: "", cdfi: "", fecha_prov: "", intercom: "", mon_fact: "", val_fact: "", factor: "", val_dol: ""},
    ]);
  };
  const eliminarDatosPC = (index) => {
    setDatosPC(datosPC.filter((_, i) => i !== index));
  };
  //DATOS DESTINATARIO
  const handleDatosDChange = (index, key, value) => {
    const nuevosDatosPC = [...datosD];
    nuevosDatosPC[index][key] = value;
    setDatosD(nuevosDatosPC);
  };
  const agregarDatosD = () => {
    setDatosD([
      ...datosD,
      { id_fiscal_d: "", nom_prov_d: "", dom_prov_d: ""},
    ]);
  };
  const eliminarDatosD = (index) => {
    setDatosD(datosD.filter((_, i) => i !== index));
  };
  //DATOS TRANSPORTE
  const handleDatosTTChange = (index, key, value) => {
    const nuevosDatosPC = [...datosTT];
    nuevosDatosPC[index][key] = value;
    setDatosTT(nuevosDatosPC);
  };
  const agregarDatosTT = () => {
    setDatosTT([
      ...datosTT,
      { id_tt: "", pais_tt: "", trans_tt: "", rfc_tt: "", curp_tt: "", dom_tt: ""},
    ]);
  };
  const eliminarDatosTT = (index) => {
    setDatosTT(datosTT.filter((_, i) => i !== index));
  };
  //CANDADOS
  const handleCandadoChange = (index, key, value) => {
    const nuevos = [...candados];
    nuevos[index][key] = value;
    setCandados(nuevos);
  };
  const agregarCandado = () => {
    setCandados([
      ...candados,
      { numero: "", primera_revision: "", segunda_revision: "" },
    ]);
  };
  const eliminarCandado = (index) => {
    setCandados(candados.filter((_, i) => i !== index));
  };


  // Agregar una contribución a la partida 'partidaIndex'
  const agregarContribucion = (partidaIndex) => {
    const nuevasPartidas = [...partidas];
    const nuevaContribucion = {
      id: Date.now() + Math.random(), // id temporal
      con: "",
      tasa: "",
      tt: "",
      fp: "",
      importe: ""
    };
    nuevasPartidas[partidaIndex].contributions.push(nuevaContribucion);
    setPartidas(nuevasPartidas);
  };

  // Eliminar contribución de una partida
  const eliminarContribucion = (partidaIndex, contribIndex) => {
    const nuevasPartidas = [...partidas];
    nuevasPartidas[partidaIndex].contributions.splice(contribIndex, 1);
    setPartidas(nuevasPartidas);
  };

  // Cambiar valor de un campo de una contribución
  const handleContribucionChange = (partidaIndex, contribIndex, key, value) => {
    const nuevasPartidas = [...partidas];
    nuevasPartidas[partidaIndex].contributions[contribIndex][key] = value;
    setPartidas(nuevasPartidas);
  };


  



  const dateToInputValue = (storedDate) => {
    if (!storedDate || storedDate === "N/A") return "";
    const parts = storedDate.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    if (day && month && year && !isNaN(new Date(`${year}-${month}-${day}`))) {
      return `${year}-${month}-${day}`;
    }
    return "";
  };
  const inputToStoredDate = (inputDate) => {
    if (!inputDate) return "N/A";
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="upload-container">
      <h2>Subir Pedimento</h2>

      <div className="upload-area">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          id="pdf-input"
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Procesando..." : "Subir y procesar"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {encabezado && (
        <div className="data-container">
          {/* Número de pedimento destacado */}
          <div className="pedimento-header">
            <h3>No. Pedimento: {encabezado.no_pedimento}</h3>
          </div>

          {/* Sección Encabezado */}
          <div className="card">
            <h3>Encabezado</h3>
            <div className="form-grid">
              {Object.keys(encabezado).map((key) => {
                if (key === "no_pedimento") return null;
                const isDateField = key === "Fecha Entrada" || key === "Fecha Pago";
                return (
                  <div className="form-field" key={key}>
                    <label>{key}:</label>
                    {isDateField ? (
                      <input
                        type="date"
                        value={dateToInputValue(encabezado[key])}
                        onChange={(e) =>
                          handleEncabezadoChange(key, inputToStoredDate(e.target.value))
                        }
                      />
                    ) : (
                      <input
                        value={encabezado[key]}
                        onChange={(e) => handleEncabezadoChange(key, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sección Tasa a nivel de pedimento */}
          <div className="card">
            <div className="card-header">
              <h3>Tasa a nivel de pedimento</h3>
              <button className="btn-add" onClick={agregarTasa}>
                + Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contribucion</th>
                    <th>Clave del tipo de tasa</th>
                    <th>Tasa</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tasa.map((c, index) => (
                    <tr key={index}>
                      <td>
                        <input value={c.contri} onChange={(e) => handleTasaChange(index, "contri", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.clvtasa} onChange={(e) => handleTasaChange(index, "clvtasa", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.tasa} onChange={(e) => handleTasaChange(index, "tasa", e.target.value)}/>
                      </td>
                      <td>
                        <button className="btn-remove" onClick={() => eliminarTasa(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Sección Cuadro liquidacion */}
          <div className="card">
            <div className="card-header">
              <h3>Cuadro de liquidacion</h3>
              <button className="btn-add" onClick={agregarCuad}>
                + Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Pago</th>
                    <th>Importe</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cuad.map((c, index) => (
                    <tr key={index}>
                      <td>
                        <input value={c.concept} onChange={(e) => handleCuadChange(index, "concept", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.pago} onChange={(e) => handleCuadChange(index, "pago", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.importe} onChange={(e) => handleCuadChange(index, "importe", e.target.value)}/>
                      </td>
                      <td>
                        <button className="btn-remove" onClick={() => eliminarCuad(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Sección Encabezado Secundari */}
          <div className="card">
            <div className="card-header">
              <h3>Encabezado Secundario</h3>
              <button className="btn-add" onClick={agregarEncSec}>
                + Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>RFC IMP/EXP</th>
                    <th>CURP IMP/EXP</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {encsec.map((c, index) => (
                    <tr key={index}>
                      <td>
                        <input value={c.rfc_i_e} onChange={(e) => handleEncSecChange(index, "rfc_i_e", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.curp_i_e} onChange={(e) => handleEncSecChange(index, "curp_i_e", e.target.value)}/>
                      </td>
                      <td>
                        <button className="btn-remove" onClick={() => eliminarEncSec(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Sección Datos Proveedor Comprador */}
          <div className="card">
            <div className="card-header">
              <h3>Datos Proveedor/Comprador</h3>
              <button className="btn-add" onClick={agregarDatosPC}>
                + Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID Fiscal</th>
                    <th>Nombre Proveedor</th>
                    <th>Domicilio Proveedor</th>
                    <th>Vinculacion</th>
                    <th>CDFI</th>
                    <th>Fecha</th>
                    <th>INTERCOM</th>
                    <th>Moneda Fact.</th>
                    <th>Val Fact.</th>
                    <th>Factor Mon. Fact.</th>
                    <th>Val. Dolares</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datosPC.map((c, index) => (
                    <tr key={index}>
                      <td>
                        <input value={c.id_fiscal} onChange={(e) => handleDatosPCChange(index, "id_fiscal", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.nom_prov} onChange={(e) => handleDatosPCChange(index, "nom_prov", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.dom_prov} onChange={(e) => handleDatosPCChange(index, "dom_prov", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.vinc} onChange={(e) => handleDatosPCChange(index, "vinc", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.cdfi} onChange={(e) => handleDatosPCChange(index, "cdfi", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.fecha_prov} onChange={(e) => handleDatosPCChange(index, "fecha_prov", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.intercom} onChange={(e) => handleDatosPCChange(index, "intercom", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.mon_fact} onChange={(e) => handleDatosPCChange(index, "mon_fact", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.val_fact} onChange={(e) => handleDatosPCChange(index, "val_fact", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.factor} onChange={(e) => handleDatosPCChange(index, "factor", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.val_dol} onChange={(e) => handleDatosPCChange(index, "val_dol", e.target.value)}/>
                      </td>
                      <td>
                        <button className="btn-remove" onClick={() => eliminarDatosPC(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Sección Datos Destinatario */}
          <div className="card">
            <div className="card-header">
              <h3>Datos Destinatario</h3>
              <button className="btn-add" onClick={agregarDatosD}>
                + Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID Fiscal</th>
                    <th>Nombre Destinatario</th>
                    <th>Domicilio Destinatario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datosD.map((c, index) => (
                    <tr key={index}>
                      <td>
                        <input value={c.id_fiscal_d} onChange={(e) => handleDatosDChange(index, "id_fiscal_d", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.nom_prov_d} onChange={(e) => handleDatosDChange(index, "nom_prov_d", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.dom_prov_d} onChange={(e) => handleDatosDChange(index, "dom_prov_d", e.target.value)}/>
                      </td>
                      <td>
                        <button className="btn-remove" onClick={() => eliminarDatosD(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Sección Datos Transporte */}
          <div className="card">
            <div className="card-header">
              <h3>Datos Transporte y Transportista</h3>
              <button className="btn-add" onClick={agregarDatosTT}>
                + Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Identificacion</th>
                    <th>Pais</th>
                    <th>Transportista</th>
                    <th>RFC</th>
                    <th>CURP</th>
                    <th>Domicilio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datosTT.map((c, index) => (
                    <tr key={index}>
                      <td>
                        <input value={c.id_tt} onChange={(e) => handleDatosTTChange(index, "id_tt", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.pais_tt} onChange={(e) => handleDatosTTChange(index, "pais_tt", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.trans_tt} onChange={(e) => handleDatosTTChange(index, "trans_tt", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.rfc_tt} onChange={(e) => handleDatosTTChange(index, "rfc_tt", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.curp_tt} onChange={(e) => handleDatosTTChange(index, "curp_tt", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.dom_tt} onChange={(e) => handleDatosTTChange(index, "dom_tt", e.target.value)}/>
                      </td>  
                      <td>
                        <button className="btn-remove" onClick={() => eliminarDatosTT(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección Candados */}
          <div className="card">
            <div className="card-header">
              <h3>Candados</h3>
              <button className="btn-add" onClick={agregarCandado}>
                + Agregar
              </button>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Primera revisión</th>
                    <th>Segunda revisión</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {candados.map((c, index) => (
                    <tr key={index}>
                      <td>
                        <input value={c.numero} onChange={(e) => handleCandadoChange(index, "numero", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.primera_revision} onChange={(e) => handleCandadoChange(index, "primera_revision", e.target.value)}/>
                      </td>
                      <td>
                        <input value={c.segunda_revision} onChange={(e) => handleCandadoChange(index, "segunda_revision", e.target.value)}/>
                      </td>
                      <td>
                        <button className="btn-remove" onClick={() => eliminarCandado(index)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección Partidas */}
          <div className="card">
            <h3>Partidas</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sec</th>
                    <th>Fracción</th>
                    <th>Subd</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Valor</th>
                    <th>Método</th>
                  </tr>
                </thead>
                  <tbody>
                    {partidas.map((p, partidaIndex) => (
                      <React.Fragment key={partidaIndex}>
                        {/* Fila principal de la partida */}
                        <tr>
                          <td className="readonly-cell">{p.sec}</td>
                          <td><input value={p.fraccion} onChange={e => handlePartidaChange(partidaIndex, "fraccion", e.target.value)} /></td>
                          <td><input value={p.subd} onChange={(e) => handlePartidaChange(partidaIndex, "subd", e.target.value)}/></td>
                          <td><input value={p.descripcion} onChange={(e) => handlePartidaChange(partidaIndex, "descripcion", e.target.value)}/></td>
                          <td><input value={p.cantidad_umc} onChange={(e) => handlePartidaChange(partidaIndex, "cantidad_umc", e.target.value)}/></td>
                          <td><input value={p.valor_aduana} onChange={(e) =>handlePartidaChange(partidaIndex, "valor_aduana", e.target.value)}/></td>
                      <td>
                        <input
                          value={p.met_val}
                          onChange={(e) =>
                            handlePartidaChange(index, "met_val", e.target.value)
                          }
                        />
                      </td>

                          <td>
                            <button onClick={() => agregarContribucion(partidaIndex)}>+ Contribución</button>
                          </td>
                        </tr>
                        {/* Fila de contribuciones (ocupa todas las columnas) */}
                        {p.contributions.length > 0 && (
                          <tr>
                            <td colSpan="7" style={{ padding: '0 0 1rem 2rem', background: '#f9f9f9' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr>
                                    <th>Concepto</th><th>Tasa</th><th>Tipo tasa</th><th>F.P.</th><th>Importe</th><th>A</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {p.contributions.map((contrib, contribIndex) => (
                                    <tr key={contrib.id}>
                                      <td><input value={contrib.con} onChange={e => handleContribucionChange(partidaIndex, contribIndex, "con", e.target.value)} /></td>
                                      <td><input value={contrib.tasa} onChange={e => handleContribucionChange(partidaIndex, contribIndex, "tasa", e.target.value)} /></td>
                                      <td><input value={contrib.tt} onChange={e => handleContribucionChange(partidaIndex, contribIndex, "tt", e.target.value)} /></td>
                                      <td><input value={contrib.fp} onChange={e => handleContribucionChange(partidaIndex, contribIndex, "fp", e.target.value)} /></td>
                                      <td><input value={contrib.importe} onChange={e => handleContribucionChange(partidaIndex, contribIndex, "importe", e.target.value)} /></td>
                                      <td><button onClick={() => eliminarContribucion(partidaIndex, contribIndex)}>🗑️</button></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>

          <div className="save-button-container">
            <button className="btn-save" onClick={handleSubmit}>
              Guardar Y Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPedimento;