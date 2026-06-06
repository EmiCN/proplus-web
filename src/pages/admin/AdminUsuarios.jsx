import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ROLES_ADMIN = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Administrativo' },
  { id: 3, nombre: 'Policía' },
  { id: 4, nombre: 'Empleado' },
];

const ROLES_ADMINISTRATIVO = [
  { id: 2, nombre: 'Administrativo' },
  { id: 3, nombre: 'Policía' },
  { id: 4, nombre: 'Empleado' },
];

const usuarioVacio = {
  numero_nomina: '', nombre: '', apellido_paterno: '',
  apellido_materno: '', contrasena: '', id_rol: 4, id_puesto: 1, id_departamento: 1
};

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPuesto, setFiltroPuesto] = useState('');
  const [puestosDB, setPuestosDB] = useState([]);
  const [departamentosDB, setDepartamentosDB] = useState([]);
  const [modalVer, setModalVer] = useState(false);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCredenciales, setModalCredenciales] = useState(false);
  const [usuarioSel, setUsuarioSel] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState(usuarioVacio);
  const [datosEdicion, setDatosEdicion] = useState({});
  const [credenciales, setCredenciales] = useState({ numero_nomina: '', contrasena: '' });
  const [verPass, setVerPass] = useState(false);
  const [verPassCred, setVerPassCred] = useState(false);
  const { usuario } = useAuth();

  const rolesDisponibles = usuario.rol === 'administrador' ? ROLES_ADMIN : ROLES_ADMINISTRATIVO;

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [resUsuarios, resPuestos, resDeptos] = await Promise.all([
        api.get('/usuarios'),
        api.get('/puestos'),
        api.get('/departamentos'),
      ]);
      setUsuarios(resUsuarios.data);
      setPuestosDB(resPuestos.data);
      setDepartamentosDB(resDeptos.data);
    } catch (error) {
      alert('Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  const cargarUsuarios = async () => {
    const res = await api.get('/usuarios');
    setUsuarios(res.data);
  };

  const abrirEditar = (item) => {
    if (!window.confirm(`¿Deseas editar a ${item.nombre} ${item.apellido_paterno}?`)) return;
    setUsuarioSel(item);
    setDatosEdicion({
      nombre: item.nombre,
      apellido_paterno: item.apellido_paterno,
      apellido_materno: item.apellido_materno || '',
      id_rol: item.id_rol || 4,
      id_puesto: item.id_puesto || 1,
      id_departamento: item.id_departamento || 1,
    });
    setModalVer(false);
    setModalEditar(true);
  };

  const guardarEdicion = async () => {
    try {
      await api.put(`/usuarios/${usuarioSel.id}`, datosEdicion);
      setModalEditar(false);
      cargarUsuarios();
      alert('Usuario actualizado correctamente');
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error al actualizar');
    }
  };

  const guardarCredenciales = async () => {
    if (!credenciales.numero_nomina) { alert('El número de nómina es obligatorio'); return; }
    try {
      await api.patch(`/usuarios/${usuarioSel.id}/credenciales`, {
        numero_nomina: credenciales.numero_nomina,
        contrasena: credenciales.contrasena || undefined,
      });
      setModalCredenciales(false);
      cargarUsuarios();
      alert('Credenciales actualizadas correctamente');
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error al actualizar credenciales');
    }
  };

  const darDeBaja = async (id) => {
    if (!window.confirm('¿Dar de baja a este usuario?')) return;
    try { await api.patch(`/usuarios/${id}/baja`); cargarUsuarios(); }
    catch (error) { alert(error.response?.data?.mensaje || 'Error'); }
  };

  const darDeAlta = async (id) => {
    try { await api.patch(`/usuarios/${id}/alta`); cargarUsuarios(); }
    catch (error) { alert(error.response?.data?.mensaje || 'Error'); }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Eliminar permanentemente este usuario?')) return;
    try { await api.delete(`/usuarios/${id}`); cargarUsuarios(); }
    catch (error) { alert('No se pudo eliminar'); }
  };

  const crearUsuario = async () => {
    if (!nuevoUsuario.numero_nomina || !nuevoUsuario.nombre || !nuevoUsuario.contrasena) {
      alert('Nómina, nombre y contraseña son obligatorios'); return;
    }
    try {
      await api.post('/usuarios', nuevoUsuario);
      setModalNuevo(false);
      setNuevoUsuario(usuarioVacio);
      cargarUsuarios();
      alert('Usuario creado correctamente');
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error al crear usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const coincideBusqueda =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.numero_nomina.toLowerCase().includes(busqueda.toLowerCase());
    const coincidePuesto = !filtroPuesto || filtroPuesto === 'Todos' || u.puesto === filtroPuesto;
    return coincideBusqueda && coincidePuesto;
  });

  if (cargando) return <div className="flex justify-center py-20 text-principal">Cargando usuarios...</div>;

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-principal mb-4">Usuarios</h1>

      <input
        className="w-full border border-gray-200 rounded-xl p-3 mb-3 bg-white text-principal focus:outline-none focus:border-principal"
        placeholder="Buscar por nombre o nómina..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
        {['Todos', ...puestosDB.map(p => p.nombre)].map(p => (
          <button key={p}
            onClick={() => setFiltroPuesto(p === 'Todos' ? '' : p)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition ${filtroPuesto === p || (p === 'Todos' && !filtroPuesto) ? 'bg-principal text-white border-principal' : 'bg-white text-gray-500 border-gray-200'}`}
          >{p}</button>
        ))}
      </div>

      <button
        onClick={() => setModalNuevo(true)}
        className="w-full bg-principal text-white font-bold py-3 rounded-xl border-b-4 border-acento hover:opacity-90 transition mb-4"
      >
        + Nuevo usuario
      </button>

      <div className="space-y-3">
        {usuariosFiltrados.length === 0 && <p className="text-center text-gray-400 py-10">No hay usuarios que coincidan</p>}
        {usuariosFiltrados.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 border-principal ${!item.activo ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              {item.foto_url
                ? <img src={item.foto_url} className="w-12 h-12 rounded-full object-cover" alt="" />
                : <div className="w-12 h-12 rounded-full bg-principal flex items-center justify-center text-white font-bold text-lg">
                    {item.nombre[0]}{item.apellido_paterno[0]}
                  </div>
              }
              <div className="flex-1">
                <p className="font-bold text-principal">{item.nombre} {item.apellido_paterno}</p>
                <p className="text-gray-400 text-xs">Nómina: {item.numero_nomina}</p>
                <p className="text-gray-400 text-xs">{item.rol} — {item.puesto || 'Sin puesto'}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.activo ? 'bg-green-100 text-secundario' : 'bg-red-100 text-red-500'}`}>
                {item.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setUsuarioSel(item); setModalVer(true); }}
                className="flex-1 bg-principal text-white text-xs font-bold py-2 rounded-lg hover:opacity-90 transition">
                👁 Ver
              </button>
              <button onClick={() => abrirEditar(item)}
                className="bg-secundario text-white text-xs font-bold py-2 px-3 rounded-lg hover:opacity-90 transition">
                ✏️
              </button>
              {item.activo
                ? <button onClick={() => darDeBaja(item.id)}
                    className="bg-orange-400 text-white text-xs font-bold py-2 px-3 rounded-lg hover:opacity-90 transition">
                    Baja
                  </button>
                : <button onClick={() => darDeAlta(item.id)}
                    className="bg-secundario text-white text-xs font-bold py-2 px-3 rounded-lg hover:opacity-90 transition">
                    Alta
                  </button>
              }
              {usuario.rol === 'administrador' && (
                <button onClick={() => eliminarUsuario(item.id)}
                  className="bg-red-500 text-white text-xs font-bold py-2 px-3 rounded-lg hover:opacity-90 transition">
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ver */}
      {modalVer && usuarioSel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col items-center mb-4">
              {usuarioSel.foto_url
                ? <img src={usuarioSel.foto_url} className="w-24 h-24 rounded-full object-cover mb-3" alt="" />
                : <div className="w-24 h-24 rounded-full bg-principal flex items-center justify-center text-white text-3xl font-bold mb-3">
                    {usuarioSel.nombre[0]}{usuarioSel.apellido_paterno[0]}
                  </div>
              }
              <h2 className="text-xl font-bold text-principal text-center">{usuarioSel.nombre} {usuarioSel.apellido_paterno} {usuarioSel.apellido_materno}</h2>
              <span className="bg-principal text-white text-xs font-bold px-3 py-1 rounded-full mt-2 uppercase">{usuarioSel.rol}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
              {[
                { label: 'Número de nómina', valor: usuarioSel.numero_nomina },
                { label: 'Puesto', valor: usuarioSel.puesto || 'No asignado' },
                { label: 'Departamento', valor: usuarioSel.departamento || 'No asignado' },
                { label: 'Estado', valor: usuarioSel.activo ? 'Activo' : 'Inactivo', color: usuarioSel.activo ? 'text-secundario' : 'text-red-500' },
                { label: 'Fecha de alta', valor: new Date(usuarioSel.fecha_alta).toLocaleDateString() },
              ].map(({ label, valor, color }) => (
                <div key={label} className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className={`font-semibold ${color || 'text-principal'}`}>{valor}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <button onClick={() => abrirEditar(usuarioSel)}
                className="flex-1 bg-secundario text-white font-bold py-3 rounded-xl hover:opacity-90 transition text-sm">
                ✏️ Editar
              </button>
              <button onClick={() => { setModalVer(false); setModalCredenciales(true); setCredenciales({ numero_nomina: usuarioSel.numero_nomina, contrasena: '' }); }}
                className="flex-1 bg-orange-400 text-white font-bold py-3 rounded-xl hover:opacity-90 transition text-sm">
                🔑 Credenciales
              </button>
            </div>
            <button onClick={() => setModalVer(false)}
              className="w-full bg-gray-100 text-principal font-bold py-3 rounded-xl hover:bg-gray-200 transition">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Credenciales */}
      {modalCredenciales && usuarioSel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-principal mb-1">Cambiar credenciales</h2>
            <p className="text-gray-400 text-sm mb-4">{usuarioSel.nombre} {usuarioSel.apellido_paterno}</p>
            <label className="text-xs text-gray-400 mb-1 block">Número de nómina</label>
            <input className="w-full border border-gray-200 rounded-xl p-3 mb-3 bg-gray-50 text-principal focus:outline-none"
              type="number" value={credenciales.numero_nomina}
              onChange={e => setCredenciales({ ...credenciales, numero_nomina: e.target.value.replace(/[^0-9]/g, '') })} />
            {usuario.rol === 'administrador' && (
              <>
                <label className="text-xs text-gray-400 mb-1 block">Nueva contraseña (vacío = no cambiar)</label>
                <div className="flex border border-gray-200 rounded-xl bg-gray-50 mb-3">
                  <input className="flex-1 p-3 bg-transparent text-principal focus:outline-none"
                    type={verPassCred ? 'text' : 'password'} value={credenciales.contrasena}
                    onChange={e => setCredenciales({ ...credenciales, contrasena: e.target.value })} />
                  <button className="px-3" onClick={() => setVerPassCred(!verPassCred)}>{verPassCred ? '🙈' : '👁'}</button>
                </div>
              </>
            )}
            <button onClick={guardarCredenciales}
              className="w-full bg-principal text-white font-bold py-3 rounded-xl border-b-4 border-acento hover:opacity-90 transition mb-2">
              Guardar
            </button>
            <button onClick={() => setModalCredenciales(false)}
              className="w-full border border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditar && usuarioSel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-principal mb-4">Editar usuario</h2>
            {[{ campo: 'nombre', label: 'Nombre' }, { campo: 'apellido_paterno', label: 'Apellido paterno' }, { campo: 'apellido_materno', label: 'Apellido materno' }].map(({ campo, label }) => (
              <div key={campo} className="mb-3">
                <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                <input className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal focus:outline-none"
                  value={datosEdicion[campo] || ''}
                  onChange={e => setDatosEdicion({ ...datosEdicion, [campo]: e.target.value })} />
              </div>
            ))}
            <label className="text-xs text-gray-400 mb-1 block">Rol</label>
            <select className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-3 focus:outline-none"
              value={datosEdicion.id_rol}
              onChange={e => setDatosEdicion({ ...datosEdicion, id_rol: parseInt(e.target.value) })}>
              {rolesDisponibles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            <label className="text-xs text-gray-400 mb-1 block">Puesto</label>
            <select className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-3 focus:outline-none"
              value={datosEdicion.id_puesto}
              onChange={e => setDatosEdicion({ ...datosEdicion, id_puesto: parseInt(e.target.value) })}>
              {puestosDB.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
            <label className="text-xs text-gray-400 mb-1 block">Departamento</label>
            <select className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-4 focus:outline-none"
              value={datosEdicion.id_departamento}
              onChange={e => setDatosEdicion({ ...datosEdicion, id_departamento: parseInt(e.target.value) })}>
              {departamentosDB.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
            <button onClick={guardarEdicion}
              className="w-full bg-principal text-white font-bold py-3 rounded-xl border-b-4 border-acento hover:opacity-90 transition mb-2">
              Guardar cambios
            </button>
            <button onClick={() => setModalEditar(false)}
              className="w-full border border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal Nuevo */}
      {modalNuevo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-principal mb-4">Nuevo usuario</h2>
            <label className="text-xs text-gray-400 mb-1 block">Número de nómina</label>
            <input className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-3 focus:outline-none"
              type="number" placeholder="12345" value={nuevoUsuario.numero_nomina}
              onChange={e => setNuevoUsuario({ ...nuevoUsuario, numero_nomina: e.target.value.replace(/[^0-9]/g, '') })} />
            {[{ campo: 'nombre', label: 'Nombre' }, { campo: 'apellido_paterno', label: 'Apellido paterno' }, { campo: 'apellido_materno', label: 'Apellido materno (opcional)' }].map(({ campo, label }) => (
              <div key={campo} className="mb-3">
                <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                <input className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal focus:outline-none"
                  value={nuevoUsuario[campo]}
                  onChange={e => setNuevoUsuario({ ...nuevoUsuario, [campo]: e.target.value })} />
              </div>
            ))}
            <label className="text-xs text-gray-400 mb-1 block">Contraseña</label>
            <div className="flex border border-gray-200 rounded-xl bg-gray-50 mb-3">
              <input className="flex-1 p-3 bg-transparent text-principal focus:outline-none"
                type={verPass ? 'text' : 'password'} value={nuevoUsuario.contrasena}
                onChange={e => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })} />
              <button className="px-3" onClick={() => setVerPass(!verPass)}>{verPass ? '🙈' : '👁'}</button>
            </div>
            <label className="text-xs text-gray-400 mb-1 block">Rol</label>
            <select className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-3 focus:outline-none"
              value={nuevoUsuario.id_rol}
              onChange={e => setNuevoUsuario({ ...nuevoUsuario, id_rol: parseInt(e.target.value) })}>
              {rolesDisponibles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            <label className="text-xs text-gray-400 mb-1 block">Puesto</label>
            <select className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-3 focus:outline-none"
              value={nuevoUsuario.id_puesto}
              onChange={e => setNuevoUsuario({ ...nuevoUsuario, id_puesto: parseInt(e.target.value) })}>
              {puestosDB.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
            <label className="text-xs text-gray-400 mb-1 block">Departamento</label>
            <select className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-principal mb-4 focus:outline-none"
              value={nuevoUsuario.id_departamento}
              onChange={e => setNuevoUsuario({ ...nuevoUsuario, id_departamento: parseInt(e.target.value) })}>
              {departamentosDB.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
            <button onClick={crearUsuario}
              className="w-full bg-principal text-white font-bold py-3 rounded-xl border-b-4 border-acento hover:opacity-90 transition mb-2">
              Guardar
            </button>
            <button onClick={() => { setModalNuevo(false); setNuevoUsuario(usuarioVacio); }}
              className="w-full border border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;