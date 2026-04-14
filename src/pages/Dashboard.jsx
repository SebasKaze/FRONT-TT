export default function Dashboard() {

  const stats = [
    { name: "Usuarios", value: 12 },
    { name: "Archivos", value: 54 },
    { name: "Procesos", value: 3 },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Dashboard
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded shadow"
          >
            <div className="text-gray-500">
              {s.name}
            </div>
            <div className="text-2xl font-bold">
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}