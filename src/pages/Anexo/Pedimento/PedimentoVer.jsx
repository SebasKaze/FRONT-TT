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
        { id: "encabezado", label: "Encabezado" },
        { id: "proveedores", label: "Proveedores" },
        { id: "transporte", label: "Transporte" },
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
                {activeTab === "proveedores" && <Proveedores data={data.proveedores} />}
                {activeTab === "transporte" && <Transporte data={data.transportes} />}
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
            <p><strong>Tipo cambio:</strong> {data.tipo_cambio}</p>
            <p><strong>Peso bruto:</strong> {data.peso_bruto}</p>
        </div>
    );
}

function Proveedores({ data }) {
    if (!data || data.length === 0) return <div className="empty-state">No hay proveedores</div>;
    return (
        <div className="table-wrapper">
            <table className="modern-table">
                <thead>
                    <tr>
                        <th>RFC / ID Fiscal</th>
                        <th>Nombre / Razón Social</th>
                        <th className="text-right">Valor Dólares</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((p, i) => (
                        <tr key={i}>
                            <td className="font-mono">{p.id_fiscal}</td>
                            <td>{p.nom_razon_social}</td>
                            <td className="text-right highlight-price">${Number(p.val_dolares).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Transporte({ data }) {
    if (!data) return <div>Sin transporte</div>;

    return (
        <div>
            {data.map((t, i) => (
                <div key={i} className="card">
                    <p>{t.transportista}</p>
                    <p>{t.pais}</p>
                </div>
            ))}
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