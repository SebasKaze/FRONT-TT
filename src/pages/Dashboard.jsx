// Dashboard.jsx
import React, { useState } from "react";
import { Chart } from "react-google-charts";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// ---------- DATOS SANKEY ---------- //
const sankeyData = [
  ["From", "To", "Weight"],
  ["Imp. Temporal (IN)", "Insumos en Producción", 450000],
  ["Imp. Activo Fijo (AF)", "Activo Fijo en Planta", 150000],

  ["Insumos en Producción", "Exportación (RT)", 380000],
  ["Insumos en Producción", "Mermas / Desperdicio", 25000],
  ["Insumos en Producción", "Cambio de Régimen (F4)", 15000],
  ["Insumos en Producción", "Transferencias (V1)", 30000],

  ["Insumos en Producción", "Saldos Vencidos", 5000],
];

// ---------- MOCK DATA ---------- //
const MOCK_PEDIMENTOS = [
  {
    id: "P001",
    fechaVencimiento: "2026-08-15",
    cantidadTotal: 100,
    cantidadUtilizada: 43,
  },
  {
    id: "P002",
    fechaVencimiento: "2026-05-25",
    cantidadTotal: 200,
    cantidadUtilizada: 180,
  },
  {
    id: "P003",
    fechaVencimiento: "2026-11-01",
    cantidadTotal: 150,
    cantidadUtilizada: 15,
  },
];

const donutData = [
  { name: "Utilizada", value: 238 },
  { name: "Pendiente", value: 212 },
];

const COLORS = ["#4F46E5", "#E5E7EB"];

const priceData = [
  { mes: "Ene", productoA: 32.5, productoB: 45.1, productoC: 28.3 },
  { mes: "Feb", productoA: 33.1, productoB: 43.8, productoC: 29.0 },
  { mes: "Mar", productoA: 34.0, productoB: 42.5, productoC: 30.2 },
  { mes: "Abr", productoA: 34.8, productoB: 44.0, productoC: 31.1 },
  { mes: "May", productoA: 35.2, productoB: 45.3, productoC: 30.8 },
  { mes: "Jun", productoA: 36.0, productoB: 46.0, productoC: 32.0 },
];

const importExportData = [
  { mes: "Ene", importacion: 120, exportacion: 80 },
  { mes: "Feb", importacion: 150, exportacion: 95 },
  { mes: "Mar", importacion: 130, exportacion: 110 },
  { mes: "Abr", importacion: 170, exportacion: 100 },
  { mes: "May", importacion: 160, exportacion: 120 },
  { mes: "Jun", importacion: 180, exportacion: 140 },
];

const topProductosVolumen = [
  { name: "Acero laminado", volumen: 450 },
  { name: "Componentes electr.", volumen: 380 },
  { name: "Plásticos PET", volumen: 310 },
  { name: "Textiles", volumen: 200 },
  { name: "Químicos base", volumen: 150 },
];

const calcularPorcentajeTiempo = (fechaVenc) => {
  const hoy = new Date().getTime();
  const venc = new Date(fechaVenc).getTime();
  const total = venc - hoy;
  const inicio = venc - 365 * 24 * 60 * 60 * 1000;

  return parseFloat(
    Math.max(0, Math.min(100, (total / (venc - inicio)) * 100)).toFixed(1)
  );
};

const sankeyOptions = {
  sankey: {
    node: {
      colors: [
        "#4F46E5",
        "#818CF8",
        "#10B981",
        "#3B82F6",
        "#F59E0B",
        "#EF4444",
      ],
      label: {
        fontSize: 13,
        color: "#374151",
        bold: true,
      },
      nodePadding: 35,
    },
    link: {
      colorMode: "gradient",
      fillOpacity: 0.2,
    },
  },
};

const Card = ({ children, className = "" }) => (
  <div
    className={`
      bg-white/90
      border border-gray-100
      rounded-2xl
      p-5
      shadow-sm
      hover:shadow-md
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </div>
);

const ProgressBar = ({ label, percentage, color }) => (
  <div className="mb-5">
    <div className="flex justify-between text-sm mb-2 text-gray-600">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>

    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      />
    </div>
  </div>
);

export default function Dashboard() {
  const [selectedPedimento, setSelectedPedimento] = useState(
    MOCK_PEDIMENTOS[0]
  );

  const pedimento = selectedPedimento;

  const porcentajeTiempo = calcularPorcentajeTiempo(
    pedimento.fechaVencimiento
  );

  const porcentajeUso = Math.round(
    (pedimento.cantidadUtilizada / pedimento.cantidadTotal) * 100
  );

  const colorTiempo =
    porcentajeTiempo < 20
      ? "#DC2626"
      : porcentajeTiempo < 40
      ? "#F59E0B"
      : "#10B981";

  const colorUso =
    porcentajeUso < 30
      ? "#10B981"
      : porcentajeUso < 70
      ? "#3B82F6"
      : "#6366F1";

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">

      {/* ===================== */}
      {/* SANKEY FULL WIDTH */}
      {/* ===================== */}

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Trazabilidad de Mercancía
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Flujo de importación, producción y descargo (Anexo 24)
            </p>
          </div>

          <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
            Valores en USD
          </span>
        </div>

        <div className="w-full h-[450px]">
          <Chart
            chartType="Sankey"
            width="100%"
            height="100%"
            data={sankeyData}
            options={sankeyOptions}
          />
        </div>
      </Card>

      {/* ===================== */}
      {/* TARJETAS RESUMEN */}
      {/* ===================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            name: "Pedimentos IMP",
            value: 12,
            color: "text-indigo-600",
          },
          {
            name: "Pedimentos EXP",
            value: 54,
            color: "text-emerald-600",
          },
          {
            name: "Otros",
            value: 3,
            color: "text-amber-500",
          },
        ].map((s, i) => (
          <Card key={i}>
            <div className="text-sm text-gray-500 mb-2">{s.name}</div>

            <div className={`text-4xl font-bold ${s.color}`}>
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      {/* ===================== */}
      {/* GRAFICAS */}
      {/* ===================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* DONUT */}
        <Card>
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Mercancía utilizada vs pendiente
          </h3>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
              >
                {donutData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* ESTATUS PEDIMENTO */}
        <Card>
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Estatus del pedimento
          </h3>

          <div className="mb-6">
            <label className="text-sm text-gray-500 block mb-2">
              Seleccionar pedimento
            </label>

            <select
              className="
                w-full
                border border-gray-200
                rounded-xl
                px-4 py-3
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-200
                transition
              "
              value={pedimento.id}
              onChange={(e) => {
                const found = MOCK_PEDIMENTOS.find(
                  (p) => p.id === e.target.value
                );

                if (found) setSelectedPedimento(found);
              }}
            >
              {MOCK_PEDIMENTOS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}
                </option>
              ))}
            </select>
          </div>

          <ProgressBar
            label="Tiempo restante"
            percentage={porcentajeTiempo}
            color={colorTiempo}
          />

          <p className="text-xs text-gray-400 mb-5">
            Vence: {pedimento.fechaVencimiento}
          </p>

          <ProgressBar
            label="Cantidad utilizada"
            percentage={porcentajeUso}
            color={colorUso}
          />

          <p className="text-xs text-gray-400">
            {pedimento.cantidadUtilizada} de{" "}
            {pedimento.cantidadTotal} utilizados
          </p>
        </Card>

        {/* LINE CHART */}
        <Card>
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Precio de venta por producto
          </h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="productoA"
                stroke="#4F46E5"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="productoB"
                stroke="#F59E0B"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="productoC"
                stroke="#10B981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* IMPORT EXPORT */}
        <Card>
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Importación vs Exportación
          </h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={importExportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="importacion"
                stackId="a"
                fill="#6366F1"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="exportacion"
                stackId="a"
                fill="#34D399"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* TOP PRODUCTOS */}
        <Card className="xl:col-span-2">
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Top productos por volumen
          </h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              layout="vertical"
              data={topProductosVolumen}
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={160}
              />

              <Tooltip />

              <Bar
                dataKey="volumen"
                fill="#8B5CF6"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}