import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminPuestos = () => {
  const [puestos, setPuestos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const { usuario } = useAuth();

  useEffect(() => { cargarPuestos(); }, []);

  const cargarPuestos = async () => {
    try {
      const res = await api.get('/puestos');
      setPuestos(res.data);
    } catch { alert('Error al cargar áreas'); }
    finally { setCargando(false); }
  };

  const abrirCrear = () => { setSeleccionado(null); setForm({ nombre: '', descripcion: '' }); setModal(true); };
  const abrirEditar = (item) => { setSeleccionado(item); setForm({ nombre: item.nombre, descripcion: item.descripcion || '' }); setModal(true); };

  const guardar = async () => {
    if (!form.nombre.trim()) { alert('El nombre es obligatorio'); return; }
    try {
      if (seleccionado) await api.put(`/puestos/${seleccionado.id}`, form);
      else await api.post('/puestos', form);
      setModal(false);
      cargarPuestos();
      alert(seleccionado ? 'Área actualizada' : 'Área creada');
    } catch (error) { alert(error.response?.data?.mensaje || 'Error al guardar'); }
  };

  const eliminar = async (item) => {
    if (!window.confirm(`¿Eliminar el área "${item.nombre}"?`)) return;
    try { await api.delete(`/puestos/${item.id}`); cargarPuestos(); alert('Área eliminada'); }
    catch (error) { alert(error.response?.data?.mensaje || 'No se pudo eliminar'); }
  };

  if (cargando) return <div className="flex justify-center py-20 text-principal">Cargando áreas...</div>;

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-principal mb-1">Áreas / Puestos</h1>
      <p className="text-gray-400 text-sm mb-4">Gestiona las áreas de trabajo</p>

      <button onClick={abrirCrear}
        className="w-full bg-principal text-white font-bold py-3 rounded-xl border-b-4 border-acento hover:opacity-90 transition mb-4">
        + Nueva área
      </button>

      <div className="space-y-3">
        {puestos.map(item => {
          const esRestringido = usuario.rol === 'administrativo' && item.nombre.toLowerCase() === 'administrativo';
          if (esRestringido) return null;
          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-secundario">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-principal flex items-center justify-center text-white font-bold text-lg">
                  {item.nombre[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-principal">{item.nombre}</p>
                  {item.descripcion && <p className="text-gray-400 text-xs">{item.descripcion}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => abrirEditar(item)}
                  className="flex-1 bg-secundario text-white text-sm font-bold py-2 rounded-lg hover:opacity-90 transition">
                  ✏️ Editar
                </button>
                {usuario.rol === 'administrador' && (
                  <button onClick={() => eliminar(item)}
                    className="flex-1 bg-red-500 text-white text-sm font-bold py-2 rounded-lg hover:opacity-90 transition">
                    🗑 Eliminar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-principal mb-4">{seleccionado ? 'Editar área' : 'Nueva área'}</h2>
            <label className="text-xs text-gray-400 mb-1 block">Nombre *</label>
            <input className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-3 focus:outline-none"
              placeholder="Ej. Producción, Seguridad..." value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <label className="text-xs text-gray-400 mb-1 block">Descripción (opcional)</label>
            <textarea className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-4 focus:outline-none resize-none"
              rows={3} placeholder="Describe el área..." value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            <button onClick={guardar}
              className="w-full bg-principal text-white font-bold py-3 rounded-xl border-b-4 border-acento hover:opacity-90 transition mb-2">
              {seleccionado ? 'Guardar cambios' : 'Crear área'}
            </button>
            <button onClick={() => setModal(false)}
              className="w-full border border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPuestos;