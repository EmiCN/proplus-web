import { useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../../services/api';

const AdminCargaMasiva = () => {
  const [cargando, setCargando] = useState(false);
  const [archivoNombre, setArchivoNombre] = useState(null);
  const [preview, setPreview] = useState([]);
  const [resultado, setResultado] = useState(null);

  const seleccionarArchivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivoNombre(file.name);
    setResultado(null);
    setCargando(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      const datos = XLSX.utils.sheet_to_json(hoja, {
        header: ['numero_nomina', 'nombre', 'apellido_paterno', 'apellido_materno'],
        range: 1,
        defval: '',
      });
      const usuariosFiltrados = datos
        .slice(0, 1000)
        .filter(u => u.numero_nomina && u.nombre && u.apellido_paterno)
        .map(u => ({
          numero_nomina: String(u.numero_nomina).trim(),
          nombre: String(u.nombre).trim(),
          apellido_paterno: String(u.apellido_paterno).trim(),
          apellido_materno: u.apellido_materno ? String(u.apellido_materno).trim() : '',
        }));
      setPreview(usuariosFiltrados);
      if (usuariosFiltrados.length === 0) alert('No se encontraron usuarios válidos. Verifica que tenga datos desde la fila 2.');
    } catch (error) {
      alert('No se pudo leer el archivo. Asegúrate de que sea un .xlsx válido.');
    } finally {
      setCargando(false);
    }
  };

  const subirUsuarios = async () => {
    if (!window.confirm(`¿Cargar ${preview.length} usuarios?\n\nContraseña: 12345\nRol: Empleado\nPuesto: Técnico`)) return;
    setCargando(true);
    try {
      const respuesta = await api.post('/usuarios/masivo', { usuarios: preview });
      setResultado(respuesta.data);
      setPreview([]);
      setArchivoNombre(null);
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-principal mb-1">Carga masiva</h1>
      <p className="text-gray-400 text-sm mb-4">Importa hasta 300 usuarios desde un archivo Excel</p>

      <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-acento mb-4">
        <h2 className="font-bold text-principal mb-3">📋 Formato del archivo</h2>
        <div className="grid grid-cols-4 gap-1 mb-3">
          {['A: Nómina', 'B: Nombre', 'C: Apellido P', 'D: Apellido M'].map(col => (
            <div key={col} className="bg-principal text-white text-xs font-bold p-2 rounded-lg text-center">{col}</div>
          ))}
        </div>
        <p className="text-gray-400 text-xs">• Datos desde fila 2</p>
        <p className="text-gray-400 text-xs">• Contraseña por defecto: <strong>12345</strong></p>
        <p className="text-gray-400 text-xs">• Rol: <strong>Empleado</strong> — Puesto: <strong>Técnico</strong></p>
      </div>

      <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-principal rounded-2xl p-8 cursor-pointer hover:bg-principal/5 transition mb-4">
        <span className="text-4xl mb-2">📂</span>
        <span className="text-principal font-bold">{archivoNombre || 'Seleccionar archivo .xlsx'}</span>
        <span className="text-gray-400 text-xs mt-1">Haz clic para seleccionar</span>
        <input type="file" accept=".xlsx" className="hidden" onChange={seleccionarArchivo} />
      </label>

      {cargando && <div className="text-center py-6 text-gray-400">Procesando archivo...</div>}

      {preview.length > 0 && !cargando && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-principal">Vista previa</h2>
            <span className="bg-principal text-white text-xs font-bold px-3 py-1 rounded-full">{preview.length} usuarios</span>
          </div>
          <div className="space-y-2 mb-4">
            {preview.slice(0, 5).map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-principal flex items-center justify-center text-white font-bold text-sm">
                  {u.nombre[0]}{u.apellido_paterno[0]}
                </div>
                <div>
                  <p className="font-semibold text-principal text-sm">{u.nombre} {u.apellido_paterno} {u.apellido_materno}</p>
                  <p className="text-gray-400 text-xs">Nómina: {u.numero_nomina}</p>
                </div>
              </div>
            ))}
            {preview.length > 5 && <p className="text-gray-400 text-xs text-center">... y {preview.length - 5} más</p>}
          </div>
          <button onClick={subirUsuarios}
            className="w-full bg-secundario text-white font-bold py-3 rounded-xl border-b-4 border-acento hover:opacity-90 transition">
            ⬆️ Cargar {preview.length} usuarios
          </button>
        </div>
      )}

      {resultado && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border-t-4 border-secundario">
          <h2 className="font-bold text-principal text-center mb-4">✅ Carga completada</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-secundario">{resultado.exitosos}</p>
              <p className="text-gray-400 text-xs mt-1">Exitosos</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-500">{resultado.fallidos}</p>
              <p className="text-gray-400 text-xs mt-1">Fallidos</p>
            </div>
          </div>
          {resultado.errores?.length > 0 && (
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-red-500 font-bold text-sm mb-2">Errores:</p>
              {resultado.errores.slice(0, 5).map((e, i) => (
                <p key={i} className="text-red-400 text-xs">• {e}</p>
              ))}
              {resultado.errores.length > 5 && <p className="text-red-400 text-xs">... y {resultado.errores.length - 5} más</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCargaMasiva;