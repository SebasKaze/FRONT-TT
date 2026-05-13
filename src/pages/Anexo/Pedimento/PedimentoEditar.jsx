import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";



function VerPedimento() {
    const { id } = useParams(); // Obtenemos el no_pedimento de la URL

    const backConection = import.meta.env.VITE_BACK_URL;

    const [formData, setFormData] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        setLoading(true);
        fetch(`${backConection}/api/verpedimentocompleto?no_pedimento=${id}`)
            .then(res => res.json())
            .then(res => {
                setData(res);
                setFormData(res); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading">Cargando datos del pedimento...</div>;
    if (!data) return <div className="error">No se encontró el pedimento {id}</div>;

    const tabs = [
        { id: "general", label: "General" },
        { id: "encabezado", label: "Encabezado Principal" },
        { id: "encabezadosec", label: "Encabezado Secundario" },
        { id: "proveedores", label: "Proveedores/Comprador" },
        { id: "destina", label: "Datos Destinatario" },
        { id: "transporte", label: "Datos transporte y transportista" },
        { id: "candados", label: "Candados" },
        { id: "totales", label: "Totales" },
        { id: "partidas", label: "Partidas" },
    ];
    const handleChange = (section, field, value, index = null) => {
        setFormData(prev => {
            const updated = structuredClone(prev);

            if (index !== null) {
                updated[section][index][field] = value;
            } else {
                updated[section][field] = value;
            }

            return updated;
        });
    };

    const handlePartidaChange = (index, field, value) => {
        setFormData(prev => {
            const updated = structuredClone(prev);

            updated.partidas[index].partida[field] = value;

            return updated;
        });
    };

    const handleContribucionChange = (partidaIndex, contribIndex, field, value) => {
        setFormData(prev => {
            const updated = structuredClone(prev);

            updated.partidas[partidaIndex]
                .contribuciones[contribIndex][field] = value;

            return updated;
        });
    };



    const handleSubmit = async () => {
        try {
            const res = await fetch(`${backConection}/api/editarpedimento`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            console.log(result);
            alert("Guardado correctamente");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container-fluid visor-pedimento">
            <header className="header-bar">
                <h2><strong>EDITAR</strong> Pedimento: <span className="highlight">{data.pedimento.no_pedimento}</span></h2>
            </header>

            {/* Navegación de Tabs */}
            <nav className="tabs-nav">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        className={activeTab === tab.id ? "active" : ""} 
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Área de Contenido Dinámico */}
            <main className="tab-content">
                {activeTab === "general" && <General data={data.pedimento} />}
                {activeTab === "encabezado" && <Encabezado data={formData.encabezado} onChange={handleChange}/>}
                {activeTab === "encabezadosec" && <EncabezadoSec data={formData.encabezadosec} onChange={handleChange} />}
                {activeTab === "proveedores" && <Proveedores data={formData.proveedores} onChange={handleChange}/>}
                {activeTab === "destina" && <Destinos data={formData.destinos} onChange={handleChange} />}
                {activeTab === "transporte" && <Transporte data={formData.transportes} onChange={handleChange}/>}
                {activeTab === "candados" && <Candados data={formData.candados} onChange={handleChange}/>}
                {activeTab === "totales" && <Totales data={formData} onChange={handleChange}/>}
                {activeTab === "partidas" && <Partidas data={formData.partidas } onPartidaChange={handlePartidaChange} onContribucionChange={handleContribucionChange}/>}
            </main>
            <button onClick={handleSubmit}>Guardar cambios</button>
        </div>
    );
}
function General({ data }) {
    return (
        <div className="info-grid">
            <div className="info-item">
                <span className="label">Tipo de Operación</span>
                <span className="value">{data.tipo_oper}</span>
            </div>
            <div className="info-item">
                <span className="label">Clave Pedimento</span>
                <span className="value">{data.clave_ped}</span>
            </div>
            <div className="info-item">
                <span className="label">Fecha y Hora</span>
                <span className="value">{data.fecha_hora}</span>
            </div>
        </div>
    );
}
function Encabezado({ data, onChange }) {
    if (!data) return <div>Sin encabezado</div>;

    return (
        <div className="card">
            <div className="form-row"><label>Regimen:</label><input value={data.regimen || ""} onChange={e => onChange("encabezado", "regimen", e.target.value)}/></div>
            <div className="form-row"><label>Destino/Origen:</label><input value={data.des_ori || ""} onChange={e => onChange("encabezado", "des_ori", e.target.value)}/></div>
            <div className="form-row"><label>Tipo cambio:</label><input value={data.tipo_cambio || ""} onChange={e => onChange("encabezado", "tipo_cambio", e.target.value)}/></div>
            <div className="form-row"><label>Peso Bruto:</label><input value={data.peso_bruto || ""} onChange={e => onChange("encabezado", "peso_bruto", e.target.value)}/></div>
            <div className="form-row"><label>Medio Transporte:</label><input value={data.medio_transpo || ""} onChange={e => onChange("encabezado", "medio_transpo", e.target.value)}/></div>
            <div className="form-row"><label>Medio Transporte Arribo:</label><input value={data.medio_transpo_arri || ""} onChange={e => onChange("encabezado", "medio_transpo_arri", e.target.value)}/></div>
            <div className="form-row"><label>Medio Transporte Salida:</label><input value={data.medio_transpo_sali || ""} onChange={e => onChange("encabezado", "medio_transpo_sali", e.target.value)}/></div>
            <div className="form-row"><label>Valor Dolares:</label><input value={data.valor_dolares || ""} onChange={e => onChange("encabezado", "valor_dolares", e.target.value)}/></div>
            <div className="form-row"><label>Valor Aduana:</label><input value={data.valor_aduana || ""} onChange={e => onChange("encabezado", "valor_aduana", e.target.value)}/></div>
            <div className="form-row"><label>Precio Pagado:</label><input value={data.precio_pagado || ""} onChange={e => onChange("encabezado", "precio_pagado", e.target.value)}/></div>
            <div className="form-row"><label>RFC IMP/EXP:</label><input value={data.rfc_import_export || ""} onChange={e => onChange("encabezado", "rfc_import_export", e.target.value)}/></div>
            <div className="form-row"><label>CURP IMP/EXP:</label><input value={data.curp_import_export || ""} onChange={e => onChange("encabezado", "curp_import_export", e.target.value)}/></div>
            <div className="form-row"><label>Razon Social:</label><input value={data.razon_so_im_ex || ""} onChange={e => onChange("encabezado", "razon_so_im_ex", e.target.value)}/></div>
            <div className="form-row"><label>Domicilio:</label><input value={data.domicilio_im_ex || ""} onChange={e => onChange("encabezado", "domicilio_im_ex", e.target.value)}/></div>
            <div className="form-row"><label>Valor Seguros:</label><input value={data.val_seguros} onChange={e => onChange("encabezado", "val_seguros", e.target.value)}/></div>
            <div className="form-row"><label>Seguros:</label><input value={data.seguros} onChange={e => onChange("encabezado", "seguros", e.target.value)}/></div>
            <div className="form-row"><label>Fletes:</label><input value={data.fletes} onChange={e => onChange("encabezado", "fletes", e.target.value)}/></div>
            <div className="form-row"><label>Embalajes:</label><input value={data.embalajes} onChange={e => onChange("encabezado", "embalajes", e.target.value)}/></div>
            <div className="form-row"><label>Otros Incrementales:</label><input value={data.otros_incremen} onChange={e => onChange("encabezado", "otros_incremen", e.target.value)}/></div>
            <div className="form-row"><label>Transporte Decremental:</label><input value={data.transpo_decremen} onChange={e => onChange("encabezado", "transpo_decremen", e.target.value)}/></div>
            <div className="form-row"><label>Seguro Decremental:</label><input value={data.seguro_decremen} onChange={e => onChange("encabezado", "seguro_decremen", e.target.value)}/></div>
            <div className="form-row"><label>Carga Decremental:</label><input value={data.carga_decemen} onChange={e => onChange("encabezado", "carga_decemen", e.target.value)}/></div>
            <div className="form-row"><label>Descargo Decremental:</label><input value={data.desc_decremen} onChange={e => onChange("encabezado", "desc_decremen", e.target.value)}/></div>
            <div className="form-row"><label>Otro Decremental:</label><input value={data.otro_decremen} onChange={e => onChange("encabezado", "otro_decremen", e.target.value)}/></div>
            <div className="form-row"><label>Acuse:</label><input value={data.acuse_electroni_val} onChange={e => onChange("encabezado", "acuse_electroni_val", e.target.value)}/></div>
            <div className="form-row"><label>Codigo de Barras:</label><input value={data.codigo_barra} onChange={e => onChange("encabezado", "codigo_barra", e.target.value)}/></div>
            <div className="form-row"><label>Total Bultos:</label><input value={data.total_bultos} onChange={e => onChange("encabezado", "total_bultos", e.target.value)}/></div>
            <div className="form-row"><label>Fecha Entrada:</label><input value={data.fecha_en || ""} onChange={e => onChange("encabezado", "fecha_en", e.target.value)}/></div>
            <div className="form-row"><label>Fecha Salida:</label><input value={data.feca_sal || ""} onChange={e => onChange("encabezado", "feca_sal", e.target.value)}/></div>
            <div className="form-row"><label>Clave Despacho:</label><input value={data.clv_sec_edu_despacho} onChange={e => onChange("encabezado", "clv_sec_edu_despacho", e.target.value)}/></div>    
        </div>
    );
}

function EncabezadoSec({ data, onChange}) {
    if (!data) return <div>Sin encabezado secundario</div>;

    return (
        <div className="card">
            <div className="form-row"><label>RFC IMP/EXP:</label><input value={data[0].rfc_import_export || ""} onChange={e => onChange("encabezadosec", "rfc_import_export", e.target.value, 0)}/></div> 
            <div className="form-row"><label>CURP IMP/EXP:</label><input value={data[0].curp_import_export || ""} onChange={e => onChange("encabezadosec", "curp_import_export", e.target.value,0)}/></div> 
            
        </div>
    );
}

function Proveedores({ data, onChange }) {
    if (!data) return <div>Sin Proveedores</div>;

    return (
        <div>
            {data.map((prov, index) => (
                <div key={index} className="card mb-3">
                    <label>ID Fiscal:</label><input value={prov.id_fiscal || ""} onChange={e => onChange("proveedores", "id_fiscal", e.target.value, index)}/>
                    <label>Razon Social:</label><input value={prov.nom_razon_social || ""} onChange={e => onChange("proveedores", "nom_razon_social", e.target.value, index)}/>
                    <label>Domicilio:</label><input value={prov.domicilio || ""} onChange={e => onChange("proveedores", "domicilio", e.target.value, index)}/>
                    <label>IVinculacion:</label><input value={prov.vinculacion || ""} onChange={e => onChange("proveedores", "vinculacion", e.target.value, index)}/>
                    <label>Numero CFDI:</label><input value={prov.no_cfdi || ""} onChange={e => onChange("proveedores", "no_cfdi", e.target.value, index)}/>
                    <label>Fecha Facturacion:</label><input value={prov.fecha_factu || ""} onChange={e => onChange("proveedores", "fecha_factu", e.target.value, index)}/>
                    <label>INCOTERM:</label><input value={prov.incoterm || ""} onChange={e => onChange("proveedores", "incoterm", e.target.value, index)}/>
                    <label>Moneda Facturacion:</label><input value={prov.moneda_fact || ""} onChange={e => onChange("proveedores", "moneda_fact", e.target.value, index)}/>
                    <label>Valor Moneda Facturacion:</label><input value={prov.val_mon_fact || ""} onChange={e => onChange("proveedores", "val_mon_fact", e.target.value, index)}/>
                    <label>Factor Moneda Facturacion:</label><input value={prov.factor_mon_fact || ""} onChange={e => onChange("proveedores", "factor_mon_fact", e.target.value, index)}/>
                    <label>Valor Dolares:</label><input value={prov.val_dolares || ""} onChange={e => onChange("proveedores", "val_dolares", e.target.value, index)}/>
                </div>
            ))}
        </div>
    );
}

function Destinos({ data, onChange }) {
    if (!data) return <div>Sin Proveedores</div>;

    return (
        <div className="card">
            <label>ID Fiscal:</label><input value={data[0].id_fiscal || ""} onChange={e => onChange("destinos", "id_fiscal", e.target.value,0)}/>
            <label>Nombre Destino:</label><input value={data[0].nom_d_d || ""} onChange={e => onChange("destinos", "nom_d_d", e.target.value,0)}/>
            <label>Domicilio Destiono:</label><input value={data[0].dom_d_d || ""} onChange={e => onChange("destinos", "dom_d_d", e.target.value,0)}/>
        </div>
    );
}

function Transporte({ data, onChange }) {
    if (!data) return <div>Sin transporte</div>;

    return (
        <div>
            {data.map((t, i) => (
                <div key={i} className="card">
                    <label>Identificacion:</label><input value={t.identificacion || ""} onChange={e => onChange("transportes", "identificacion", e.target.value, i)}/>
                    <label>Pais:</label><input value={t.pais || ""} onChange={e => onChange("transportes", "pais", e.target.value, i)}/>
                    <label>Transportista:</label><input value={t.transportista || ""} onChange={e => onChange("transportes", "transportista", e.target.value, i)}/>
                    <label>RFC Transportista:</label><input value={t.rfc_transportista || ""} onChange={e => onChange("transportes", "rfc_transportista", e.target.value, i)}/>
                    <label>CURP Transportista:</label><input value={t.curp_transportista || ""} onChange={e => onChange("transportes", "curp_transportista", e.target.value, i)}/>
                    <label>Domicilio Transportista:</label><input value={t.domicilio_transportista || ""} onChange={e => onChange("transportes", "domicilio_transportista", e.target.value, i)}/>
                </div>
            ))}
        </div>
    );
}

function Candados({ data, onChange }) {
    if (!data) return <div>Sin Candados</div>;

    return (
        <div className="card">
            <label>Numero Candado:</label><input value={data[0].numero_candado || ""} onChange={e => onChange("candados", "numero_candado", e.target.value,0)}/>
            <label>Revision 1:</label><input value={data[0].revision1 || ""} onChange={e => onChange("candados", "revision1", e.target.value,0)}/>
            <label>Revision 2:</label><input value={data[0].revision2 || ""} onChange={e => onChange("candados", "revision2", e.target.value,0)}/>
        </div>
    );
}

function Totales({ data, onChange }) {
    return (
        <div className="card">
            <h3>Totales</h3>
            <p>Efectivo: {data.totales?.efectivo}</p>
            <p>Total: {data.totales?.total}</p>

            <h3>Tasas</h3>
            {data.tasas?.map((t, i) => (
                <p key={i}>{t.contribucion} - {t.tasa}</p>
            ))}
        </div>
    );
}



function Partidas({ data, onPartidaChange, onContribucionChange }) {
    const [open, setOpen] = useState(null);
    if (!data) return <div className="empty-state">Sin partidas</div>;

    return (
        <div className="accordion">
            {data.map((p, i) => (
                <div key={i} className={`accordion-item ${open === i ? 'is-open' : ''}`}>
                    <div className="accordion-header" onClick={() => setOpen(open === i ? null : i)}>
                        <div className="header-info">
                            <span className="badge">Sec: {p.partida.sec}</span>
                            <span className="desc">{p.partida.descripcion}</span>
                        </div>
                        <span className="icon">{open === i ? '−' : '+'}</span>
                    </div>
                    {open === i && (
                        <div className="accordion-body">
                            <div className="sub-grid">
                                <div><strong>Fracción:</strong> {p.partida.fraccion}</div>
                                <div><strong>Subd:</strong> {p.partida.subd}</div>
                                <div><strong>MetVal:</strong> <input value={p.partida.met_val || ""} onChange={e => onPartidaChange(i, "met_val", e.target.value)}/></div>
                                <div><strong>UMC:</strong> {p.partida.id_umc}</div>
                                <div><strong>Cantidad UMC:</strong> {p.partida.cantidad_umc}</div>
                                <div><strong>UMT:</strong> {p.partida.id_umt}</div>
                                <div><strong>Cantidad UMT:</strong> {p.partida.cantidad_umt}</div>
                                <div><strong>Descripcion:</strong> <input value={p.partida.descripcion || ""} onChange={e => onPartidaChange(i, "descripcion", e.target.value)}/></div>
                                <div><strong>PRECIO UNIT.:</strong> <input value={p.partida.precio_unit || ""} onChange={e => onPartidaChange(i, "precio_unit", e.target.value)}/></div>
                                <div><strong>Valor Aduana:</strong> <input value={p.partida.valor_aduana || ""} onChange={e => onPartidaChange(i, "valor_aduana", e.target.value)}/>  </div>
                                <div><strong>Vinc.:</strong> <input value={p.partida.vinc || ""} onChange={e => onPartidaChange(i, "vinc", e.target.value)}/></div>
                                <div><strong>P. V/C:</strong> <input value={p.partida.pvc || ""} onChange={e => onPartidaChange(i, "pvc", e.target.value)}/></div>
                                <div><strong>P. O/D:</strong> <input value={p.partida.pod || ""} onChange={e => onPartidaChange(i, "pod", e.target.value)}/></div>
                                <div><strong>IMP. PRECIO PAG./VALOR COMERCIAL.:</strong> <input value={p.partida.imp_precio_pag || ""} onChange={e => onPartidaChange(i, "imp_precio_pag", e.target.value)}/></div>
                                <div><strong>VAL. AGREG.:</strong> <input value={p.partida.val_agreg || ""} onChange={e => onPartidaChange(i, "val_agreg", e.target.value)}/></div>
                                <div><strong>MARCA.:</strong> <input value={p.partida.marca || ""} onChange={e => onPartidaChange(i, "marca", e.target.value)}/></div>
                                <div><strong>MODELO.:</strong> <input value={p.partida.modelo || ""} onChange={e => onPartidaChange(i, "modelo", e.target.value)}/></div>
                                <div><strong>CÓDIGO PRODUCTO:</strong> <input value={p.partida.codigo_produ || ""} onChange={e => onPartidaChange(i, "codigo_produ", e.target.value)}/></div>
                                <div><strong>Fracción:</strong> <input value={p.partida.obser || ""} onChange={e => onPartidaChange(i, "obser", e.target.value)}/></div>

                            </div>
                            <h5>Contribuciones de la Partida</h5>
                            <table className="mini-table">
                                <thead>
                                    <tr>
                                        <th>Contribución</th>
                                        <th>Tasa</th>
                                        <th>Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {p.contribuciones?.map((c, j) => (
                                        <tr key={j}>
                                            <td><input value={c.contribucion} onChange={e => onContribucionChange(i, j, "contribucion", e.target.value)}/></td>
                                            <td>{c.tasa}</td>
                                            <td>${c.importe}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
export default VerPedimento;