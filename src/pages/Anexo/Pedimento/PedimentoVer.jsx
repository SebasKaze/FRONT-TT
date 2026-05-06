import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VerPedimento() {
    const { id } = useParams(); // Obtenemos el no_pedimento de la URL

    const backConection = import.meta.env.VITE_BACK_URL;

    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        setLoading(true);
        fetch(`${backConection}/api/verpedimentocompleto?no_pedimento=${id}`)
            .then(res => res.json())
            .then(res => {
                setData(res);
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
        { id: "encasec", label: "Encabezado Secundario" },
        { id: "proveedores", label: "Proveedores/Comprador" },
        { id: "destina", label: "Datos Destinatario" },
        { id: "transporte", label: "Datos transporte y transportista" },
        { id: "candados", label: "Candados" },
        { id: "totales", label: "Totales" },
        { id: "partidas", label: "Partidas" },
    ];

    return (
        <div className="container-fluid visor-pedimento">
            <header className="header-bar">
                <h2>Pedimento: <span className="highlight">{data.pedimento.no_pedimento}</span></h2>
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
                {activeTab === "encabezado" && <Encabezado data={data.encabezado} />}
                {activeTab === "encasec" && <EncabezadoSec data={data.encabezadosec} />}
                {activeTab === "proveedores" && <Proveedores data={data.proveedores} />}
                {activeTab === "destina" && <Destinos data={data.destinos} />}
                {activeTab === "transporte" && <Transporte data={data.transportes} />}
                {activeTab === "candados" && <Candados data={data.candados} />}
                {activeTab === "totales" && <Totales data={data} />}
                {activeTab === "partidas" && <Partidas data={data.partidas} />}
            </main>
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
function Encabezado({ data }) {
    if (!data) return <div>Sin encabezado</div>;

    return (
        <div className="card">
            <p><strong>Régimen:</strong> {data.regimen}</p>
            <p><strong>Destino/Origen:</strong> {data.des_ori}</p>
            <p><strong>Tipo cambio:</strong> {data.tipo_cambio}</p>
            <p><strong>Peso Bruto:</strong> {data.peso_bruto}</p>
            <p><strong>Aduana E/S:</strong> {data.aduana_e_s}</p>
            <p><strong>Medio Transporte:</strong> {data.medio_transpo}</p>
            <p><strong>Medio Transporte Arribo:</strong> {data.medio_transpo_arri}</p>
            <p><strong>Medio Transporte Salida:</strong> {data.medio_transpo_sali}</p>
            <p><strong>Valor Dolares:</strong> {data.valor_dolares}</p>
            <p><strong>Valor Aduana:</strong> {data.valor_aduana}</p>
            <p><strong>Precio Pagado:</strong> {data.precio_pagado}</p>
            <p><strong>RFC IMP/EXP</strong> {data.rfc_import_export}</p>
            <p><strong>CURP IMP/EXP:</strong> {data.curp_import_export}</p>
            <p><strong>Razon Social:</strong> {data.razon_so_im_ex}</p>
            <p><strong>Domicilio:</strong> {data.domicilio_im_ex}</p>
            <p><strong>Valor Seguros:</strong> {data.val_seguros}</p>
            <p><strong>Seguros:</strong> {data.seguros}</p>
            <p><strong>Fletes:</strong> {data.fletes}</p>
            <p><strong>Embalajes:</strong> {data.embalajes}</p>
            <p><strong>Otros Incrementales:</strong> {data.otros_incremen}</p>
            <p><strong>Transporte Decremental:</strong> {data.transpo_decremen}</p>
            <p><strong>Seguro Decremental:</strong> {data.seguro_decremen}</p>
            <p><strong>Carga Decremental:</strong> {data.carga_decemen}</p>
            <p><strong>Descargo Decremental:</strong> {data.desc_decremen}</p>
            <p><strong>Otro Decremental:</strong> {data.otro_decremen}</p>
            <p><strong>Acuse:</strong> {data.acuse_electroni_val}</p>
            <p><strong>Codigo de Barras:</strong> {data.codigo_barra}</p>
            <p><strong>Total Bultos:</strong> {data.total_bultos}</p>
            <p><strong>Fecha Entrada:</strong> {data.fecha_en}</p>
            <p><strong>Fecha Salida:</strong> {data.feca_sal}</p>
            <p><strong>Clave Despacho:</strong> {data.clv_sec_edu_despacho}</p>
        </div>
    );
}

function EncabezadoSec({ data }) {
    if (!data) return <div>Sin encabezado secundario</div>;

    return (
        <div className="card">
            <p><strong>RFC IMP/EXP:</strong> {data.rfc_import_export}</p>
            <p><strong>CURP IMP/EXP:</strong> {data.curp_import_export}</p>
        </div>
    );
}

function Proveedores({ data }) {
    if (!data) return <div>Sin Proveedores</div>;

    return (
        <div>
            {data.map((prov, index) => (
                <div key={index} className="card mb-3">
                    <p><strong>ID Fiscal:</strong> {prov.id_fiscal}</p>
                    <p><strong>Razon Social:</strong> {prov.nom_razon_social}</p>
                    <p><strong>Domicilio:</strong> {prov.domicilio}</p>
                    <p><strong>Vinculacion:</strong> {prov.vinculacion}</p>
                    <p><strong>Numero CFDI:</strong> {prov.no_cfdi}</p>
                    <p><strong>Fecha Facturacion:</strong> {prov.fecha_factu}</p>
                    <p><strong>INCOTERM:</strong> {prov.incoterm}</p>
                    <p><strong>Moneda Facturacion:</strong> {prov.moneda_fact}</p>
                    <p><strong>Valor Moneda Facturacion:</strong> {prov.val_mon_fact}</p>
                    <p><strong>Factor Moneda Facturacion:</strong> {prov.factor_mon_fact}</p>
                    <p><strong>Valor Dolares:</strong> {prov.val_dolares}</p>
                </div>
            ))}
        </div>
    );
}

function Destinos({ data }) {
    if (!data) return <div>Sin Proveedores</div>;

    return (
        <div className="card">
            <p><strong>ID Fiscal:</strong> {data.id_fiscal}</p>
            <p><strong>Nombre Destino:</strong> {data.nom_d_d}</p>
            <p><strong>Domicilio Destiono:</strong> {data.dom_d_d}</p>
        </div>
    );
}

function Transporte({ data }) {
    if (!data) return <div>Sin transporte</div>;

    return (
        <div>
            {data.map((t, i) => (
                <div key={i} className="card">
                    <p><strong>Identificacion:</strong>{t.identificacion}</p>
                    <p><strong>Pais:</strong>{t.pais}</p>
                    <p><strong>Transportista:</strong>{t.transportista}</p>
                    <p><strong>RFC Transportista:</strong>{t.rfc_transportista}</p>
                    <p><strong>CURP Transportista:</strong>{t.curp_transportista}</p>
                    <p><strong>Domicilio Transportista:</strong>{t.domicilio_transportista}</p>
                </div>
            ))}
        </div>
    );
}

function Candados({ data }) {
    if (!data) return <div>Sin Candados</div>;

    return (
        <div className="card">
            <p><strong>Numero Candado:</strong> {data.numero_candado}</p>
            <p><strong>Revision 1:</strong> {data.revision1}</p>
            <p><strong>Revision 2:</strong> {data.revision2}</p>
        </div>
    );
}

function Totales({ data }) {
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



function Partidas({ data }) {
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
                                <div><strong>Valor Aduana:</strong> ${p.partida.valor_aduana}</div>
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
                                            <td>{c.contribucion}</td>
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