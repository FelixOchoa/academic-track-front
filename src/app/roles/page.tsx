'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Plus,
  Users,
  Key,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Lock,
  Search,
} from 'lucide-react';
import { roleService } from '@/services/roleService';
import { Role, Permission, UserWithRole } from '@/types/roles';

export default function RolesManagementPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');

  // Estados de Roles y Permisos
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados del Modal de Rol
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  // Estados de Asignación de Roles a Usuarios
  const [userRoleSelections, setUserRoleSelections] = useState<Record<number, number>>({});
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Cargar datos iniciales
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedRoles, fetchedPermissions, fetchedUsers] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
        roleService.getUsers(),
      ]);
      setRoles(fetchedRoles);
      setPermissions(fetchedPermissions);
      setUsers(fetchedUsers);

      // Inicializar selecciones de rol por usuario
      const initialMap: Record<number, number> = {};
      fetchedUsers.forEach((u) => {
        if (u.roleId) initialMap[u.id] = u.roleId;
      });
      setUserRoleSelections(initialMap);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar roles y permisos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Agrupar permisos por módulo
  const permissionsByModule = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      const moduleName = p.module || 'General';
      if (!map[moduleName]) map[moduleName] = [];
      map[moduleName].push(p);
    });
    return map;
  }, [permissions]);

  // Abrir modal para nuevo rol
  const handleOpenCreateModal = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissionIds([]);
    setModalOpen(true);
    setError(null);
  };

  // Abrir modal para editar rol
  const handleOpenEditModal = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || '');
    setSelectedPermissionIds(role.permissions.map((p) => p.id));
    setModalOpen(true);
    setError(null);
  };

  // Toggle de un permiso individual
  const handleTogglePermission = (id: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  // Seleccionar / Deseleccionar todos los permisos de un módulo
  const handleToggleModulePermissions = (moduleName: string) => {
    const modulePerms = permissionsByModule[moduleName] || [];
    const modulePermIds = modulePerms.map((p) => p.id);
    const allSelected = modulePermIds.every((id) => selectedPermissionIds.includes(id));

    if (allSelected) {
      setSelectedPermissionIds((prev) => prev.filter((id) => !modulePermIds.includes(id)));
    } else {
      setSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...modulePermIds])));
    }
  };

  // Guardar rol (Crear o Actualizar)
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError('El nombre del rol es requerido.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingRole) {
        await roleService.updateRole(editingRole.id, {
          name: roleName.trim(),
          description: roleDescription.trim(),
          permissionIds: selectedPermissionIds,
        });
        setSuccessMessage(`Rol '${roleName}' actualizado exitosamente.`);
      } else {
        await roleService.createRole({
          name: roleName.trim(),
          description: roleDescription.trim(),
          permissionIds: selectedPermissionIds,
        });
        setSuccessMessage(`Rol '${roleName}' creado exitosamente.`);
      }

      setModalOpen(false);
      await loadData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el rol.');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar rol
  const handleDeleteRole = async (role: Role) => {
    if (role.isSystemRole) {
      alert('No se pueden eliminar los roles predeterminados del sistema.');
      return;
    }
    if (role.usersCount > 0) {
      alert(`No se puede eliminar el rol '${role.name}' porque tiene ${role.usersCount} usuario(s) asignado(s).`);
      return;
    }
    if (!confirm(`¿Estás seguro de que deseas eliminar el rol '${role.name}'?`)) {
      return;
    }

    try {
      setLoading(true);
      await roleService.deleteRole(role.id);
      setSuccessMessage(`Rol '${role.name}' eliminado exitosamente.`);
      await loadData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el rol.');
    } finally {
      setLoading(false);
    }
  };

  // Guardar asignación de rol a usuario
  const handleAssignRole = async (userId: number) => {
    const roleId = userRoleSelections[userId];
    if (!roleId) return;

    try {
      setSaving(true);
      await roleService.assignUserRole(userId, roleId);
      setSuccessMessage('Rol de usuario actualizado correctamente.');
      await loadData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al asignar el rol.');
    } finally {
      setSaving(false);
    }
  };

  // Filtrado de usuarios por búsqueda
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return users;
    const term = userSearchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.roleName.toLowerCase().includes(term)
    );
  }, [users, userSearchTerm]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-[#548a1a] dark:text-[#afdd7a] rounded-full text-xs font-bold mb-2 border border-emerald-200/50 dark:border-emerald-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            Control de Acceso Basado en Roles (RBAC)
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestión de Roles y Permisos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra los roles del sistema, define permisos específicos por módulo y asígnalos a los usuarios.
          </p>
        </div>

        {activeTab === 'roles' && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#67a623] to-[#548a1a] hover:from-[#5da01a] hover:to-[#4a7d14] text-white font-bold rounded-xl shadow-md shadow-[#67a623]/20 transition-all active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Rol</span>
          </button>
        )}
      </div>

      {/* Alertas */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-center gap-3 text-rose-800 dark:text-rose-300 text-sm font-semibold animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'roles'
              ? 'text-[#548a1a] dark:text-[#afdd7a]'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Roles del Sistema ({roles.length})
          </span>
          {activeTab === 'roles' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#548a1a] dark:bg-[#afdd7a] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'users'
              ? 'text-[#548a1a] dark:text-[#afdd7a]'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Asignación de Usuarios ({users.length})
          </span>
          {activeTab === 'users' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#548a1a] dark:bg-[#afdd7a] rounded-full" />
          )}
        </button>
      </div>

      {/* Contenido según Tab */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#548a1a]" />
          <span className="text-sm font-semibold">Cargando información de roles y permisos...</span>
        </div>
      ) : activeTab === 'roles' ? (
        /* Grid de Roles */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-5"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-[#548a1a] dark:text-[#afdd7a]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                        {role.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Users className="w-3.5 h-3.5" />
                        <span>{role.usersCount} usuario(s)</span>
                      </div>
                    </div>
                  </div>

                  {role.isSystemRole && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-lg shrink-0">
                      <Lock className="w-3 h-3" />
                      Sistema
                    </span>
                  )}
                </div>

                {/* Descripción */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 font-medium">
                  {role.description || 'Sin descripción asignada.'}
                </p>

                {/* Permisos */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Permisos ({role.permissions.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {role.permissions.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Sin permisos asociados</span>
                    ) : (
                      role.permissions.map((perm) => (
                        <span
                          key={perm.id}
                          title={perm.description || perm.name}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-md border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {perm.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => handleOpenEditModal(role)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                {!role.isSystemRole && (
                  <button
                    onClick={() => handleDeleteRole(role)}
                    disabled={role.usersCount > 0}
                    title={
                      role.usersCount > 0
                        ? 'No se puede eliminar: tiene usuarios asignados'
                        : 'Eliminar este rol'
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Pestaña: Asignación de Usuarios */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar usuario por nombre, correo o rol..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#67a623]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider rounded-xl">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Usuario</th>
                  <th className="py-3 px-4">Correo</th>
                  <th className="py-3 px-4">Rol Asignado</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {u.fullName || u.username}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={userRoleSelections[u.id] || u.roleId || ''}
                          onChange={(e) =>
                            setUserRoleSelections((prev) => ({
                              ...prev,
                              [u.id]: parseInt(e.target.value, 10),
                            }))
                          }
                          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                        >
                          <option value="" disabled>
                            Selecciona un rol
                          </option>
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            u.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {u.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleAssignRole(u.id)}
                          disabled={
                            saving ||
                            !userRoleSelections[u.id] ||
                            userRoleSelections[u.id] === u.roleId
                          }
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
                        >
                          {saving ? 'Guardando...' : 'Actualizar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Rol */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 text-[#548a1a] rounded-xl">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingRole ? `Editar Rol: ${editingRole.name}` : 'Crear Nuevo Rol'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configura el nombre y selecciona los permisos asignados a este perfil.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveRole} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Campos Básicos */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="ej. Auditor Académico"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Breve resumen de responsabilidades y alcance del rol"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                  />
                </div>
              </div>

              {/* Permisos por Módulo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Permisos de Acceso ({selectedPermissionIds.length} seleccionados)
                  </h3>
                </div>

                <div className="space-y-4">
                  {Object.entries(permissionsByModule).map(([moduleName, modulePerms]) => {
                    const modulePermIds = modulePerms.map((p) => p.id);
                    const allSelected = modulePermIds.every((id) =>
                      selectedPermissionIds.includes(id)
                    );

                    return (
                      <div
                        key={moduleName}
                        className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#548a1a]" />
                            Módulo: {moduleName}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleToggleModulePermissions(moduleName)}
                            className="text-[11px] font-bold text-[#548a1a] hover:text-[#67a623] transition-colors"
                          >
                            {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {modulePerms.map((perm) => {
                            const isChecked = selectedPermissionIds.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-white dark:bg-slate-900 border-[#67a623] shadow-sm'
                                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(perm.id)}
                                  className="mt-0.5 rounded text-[#67a623] focus:ring-[#67a623] shrink-0"
                                />
                                <div>
                                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                    {perm.name}
                                  </span>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                                    {perm.description}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#67a623] to-[#548a1a] hover:from-[#5da01a] hover:to-[#4a7d14] text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingRole ? 'Guardar Cambios' : 'Crear Rol'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
