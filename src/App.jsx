import { BrowserRouter, Routes, Route } from "react-router-dom"

import { AuthProvider } from "./context/AuthContext";


import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

import Login from "./pages/Login";


import Layout from "./layout/Layout"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"

//IMPORTS PAGINAS
//Pedimentos
import Pedimento from "./pages/Anexo/Pedimento/Pedimentos"
import PedimentoVer from "./pages/Anexo/Pedimento/PedimentoVer"
import PedimentoEditar from "./pages/Anexo/Pedimento/PedimentoEditar"

//Procesos
import EntradaMercancia from "./pages/Anexo/Procesos/EntradaMercancia"
import SalidaMercancia from "./pages/Anexo/Procesos/SalidaMercancia"
import Saldo from "./pages/Anexo/Procesos/Saldos"
import MaterialUtilizado from "./pages/Anexo/Procesos/MaterialesUtilizados"


//Catalogos
import Productos from "./pages/Anexo/Catalogos/Productos"
import Materiales from "./pages/Anexo/Catalogos/Materiales"
import Productos_Carga from "./pages/Anexo/Catalogos/Productos_Carga"
import Materiales_Carga from "./pages/Anexo/Catalogos/Materiales_Carga"

//Carga Manual
import CargaManual from "./pages/Anexo/CargaDatos/CargaManual/CManualForm"
import CargaMasiva from "./pages/Anexo/CargaDatos/CargaMasiva/CargaMasiva"

//Empresa
import DatosGenerales from "./pages/Anexo/DatosUsuario/DatosGenerales"
import Domicilios from "./pages/Anexo/DatosUsuario/Domicilios"
import RegistroEmpresa from "./pages/Anexo/DatosUsuario/Registro"

//Activo Fijo
import ActivoFijo from "./pages/Anexo/ActivoFijo/ActivoFijo"
import ActivoFijoCrear from "./pages/Anexo/ActivoFijo/CrearActivo"






function App() {

  return (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        
        {/*PUBLICA*/}
        <Route path="/login" element={<Login/>}/>
        
        {/*PROTEGIDAS*/}
        <Route element={<PrivateRoute><Layout/></PrivateRoute>}>
          <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>}/>
          <Route path="/" element={<Home />} />
          {/* Pedimentos */}
          <Route path="/pedimento" element={<PrivateRoute> <Pedimento /> </PrivateRoute>}/>
          <Route path="/pedimentos/editar/:id" element={<PrivateRoute> <PedimentoEditar /> </PrivateRoute>}/>
          <Route path="/pedimentos/ver/:id" element={<PrivateRoute> <PedimentoVer /> </PrivateRoute>}/>
          {/* Catalogos */}
          <Route path="/productos" element={<Productos />}/>
          <Route path="/materiales" element={<Materiales />}/>
          <Route path="/productos_carga" element={<Productos_Carga />}/>
          <Route path="/materiales_carga" element={<Materiales_Carga />}/>
          {/* Procesos */}
          <Route path="/entrada_mercancia" element={<EntradaMercancia />}/>
          <Route path="/salida_mercancia" element={<SalidaMercancia />}/>
          <Route path="/saldo" element={<Saldo />}/>
          <Route path="/materiales_utilizados" element={<MaterialUtilizado />}/>
          {/* Activo Fijo */}
          <Route path="/activofijo" element={<ActivoFijo />}/>
          <Route path="/activofijocrear" element={<ActivoFijoCrear />}/>
          {/* Cargas */}
          <Route path="/carga_manual" element={<CargaManual />}/>
          <Route path="/carga_masiva" element={<CargaMasiva />}/>
          <Route path="/cargadocumentos" element={<CargaMasiva />}/>
          {/* Datos Generales */}
          <Route path="/datos_generales" element={<DatosGenerales />}/>
          <Route path="/domicilios" element={<Domicilios />}/>
          <Route path="/registrar_empresa" element={<RegistroEmpresa />}/>
          {/*Routa por defecto*/}
          <Route path="*" element={<Home />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>

  )
}
export default App