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
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import { roleService } from '@/services/roleService';
import { Role, Permission, UserWithRole } from '@/types/roles';
import { usePermissions } from '@/hooks/usePermissions';

export default function RolesManagementPage() {
  const { hasPermission, isAdmin } = usePermissions();

  const canManageRoles = isAdmin || hasPermission('ROLES_MANAGE');
  const canAssignUsers = isAdmin || hasPermission('USERS_ASSIGN') || hasPermission('ROLES_MANAGE');

  const [activeTab, setActiveTab] = useState<'roles' | 'users'>(() =>
    canManageRoles ? 'roles' : 'users'
  );

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

  // Estados del Modal de Creación de Usuario
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userFormError, setUserFormError] = useState<string | null>(null);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRoleId, setNewRoleId] = useState<number | ''>('');

  // Estados de Asignación de Roles a Usuarios
  const [userRoleSelections, setUserRoleSelections] = useState<Record<number, number>>({});
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Cargar datos iniciales
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedRoles, fetchedPermissions, fetchedUsers] = await Promise.all([
        roleService.getRoles().catch(() => []),
        roleService.getPermissions().catch(() => []),
        roleService.getUsers().catch(() => []),
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

  // Ajustar la pestaña activa si no tiene permiso para ver roles
  useEffect(() => {
    if (!canManageRoles && canAssignUsers && activeTab === 'roles') {
      setActiveTab('users');
    }
  }, [canManageRoles, canAssignUsers, activeTab]);

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
      setSelectedPermissionIds((prev) => [
        ...prev,
        ...modulePermIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  // Guardar (Crear o Editar) Rol
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError('El nombre del rol es requerido.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editingRole) {
        const updated = await roleService.updateRole(editingRole.id, {
          name: roleName.trim(),
          description: roleDescription.trim(),
          permissionIds: selectedPermissionIds,
        });
        setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setSuccessMessage(`Rol "${updated.name}" actualizado exitosamente.`);
      } else {
        const created = await roleService.createRole({
          name: roleName.trim(),
          description: roleDescription.trim(),
          permissionIds: selectedPermissionIds,
        });
        setRoles((prev) => [...prev, created]);
        setSuccessMessage(`Rol "${created.name}" creado exitosamente.`);
      }
      setModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el rol.');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar Rol
  const handleDeleteRole = async (role: Role) => {
    if (role.isSystemRole) {
      setError('Los roles predefinidos del sistema no pueden ser eliminados.');
      return;
    }

    if (role.usersCount > 0) {
      setError(`No es posible eliminar el rol "${role.name}" porque tiene ${role.usersCount} usuario(s) asignado(s).`);
      return;
    }

    const confirmDelete = window.confirm(`¿Estás seguro de eliminar el rol "${role.name}"?`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await roleService.deleteRole(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      setSuccessMessage(`Rol "${role.name}" eliminado correctamente.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el rol.');
    } finally {
      setLoading(false);
    }
  };

  // Asignar Rol a un Usuario
  const handleAssignRole = async (userId: number) => {
    const selectedRoleId = userRoleSelections[userId];
    if (!selectedRoleId) return;

    setSaving(true);
    setError(null);
    try {
      const updatedUser = await roleService.assignUserRole(userId, selectedRoleId);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      setSuccessMessage(`Rol de ${updatedUser.fullName} actualizado a "${updatedUser.roleName}".`);
      setTimeout(() => setSuccessMessage(null), 4000);

      // Recargar roles para actualizar contadores de usuarios
      const fetchedRoles = await roleService.getRoles();
      setRoles(fetchedRoles);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al asignar el rol al usuario.');
    } finally {
      setSaving(false);
    }
  };

  // Crear Nuevo Usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError(null);

    if (!newFullName.trim()) {
      setUserFormError('El nombre completo es obligatorio.');
      return;
    }
    if (!newUsername.trim()) {
      setUserFormError('El nombre de usuario es obligatorio.');
      return;
    }
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setUserFormError('Debe ingresar un correo electrónico válido.');
      return;
    }
    if (!newPassword.trim() || newPassword.length < 6) {
      setUserFormError('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }

    setCreatingUser(true);
    try {
      const createdUser = await roleService.createUser({
        fullName: newFullName.trim(),
        username: newUsername.trim(),
        email: newEmail.trim(),
        password: newPassword,
        roleId: newRoleId ? Number(newRoleId) : undefined,
      });

      setUsers((prev) => [...prev, createdUser]);
      if (createdUser.roleId) {
        setUserRoleSelections((prev) => ({
          ...prev,
          [createdUser.id]: createdUser.roleId!,
        }));
      }

      setSuccessMessage(`Usuario "${createdUser.fullName}" (@${createdUser.username}) creado con éxito.`);
      setTimeout(() => setSuccessMessage(null), 4500);

      // Recargar conteo de roles
      const fetchedRoles = await roleService.getRoles();
      setRoles(fetchedRoles);

      setUserModalOpen(false);
      setNewFullName('');
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setNewRoleId('');
    } catch (err: unknown) {
      setUserFormError(err instanceof Error ? err.message : 'Error al crear el usuario.');
    } finally {
      setCreatingUser(false);
    }
  };

  // Filtrado de usuarios por término de búsqueda
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

  if (!canManageRoles && !canAssignUsers) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-8 text-center max-w-lg mx-auto shadow-xl">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Acceso Denegado
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No tienes los permisos requeridos (`ROLES_MANAGE` o `USERS_ASSIGN`) para ver o gestionar roles y asignaciones del sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-[#67a623] to-[#548a1a] rounded-2xl text-white shadow-lg shadow-[#67a623]/25 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Gestión de Roles y Permisos
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Control de acceso granular por perfiles y asignación de usuarios del sistema
            </p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-3">
          {activeTab === 'roles' && canManageRoles && (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#67a623] to-[#548a1a] hover:from-[#5da01a] hover:to-[#4a7d14] text-white text-xs font-bold rounded-xl shadow-md shadow-[#67a623]/20 transition-all hover:shadow-lg hover:shadow-[#67a623]/30 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Rol</span>
            </button>
          )}

          {activeTab === 'users' && canAssignUsers && (
            <button
              onClick={() => {
                setUserFormError(null);
                setNewFullName('');
                setNewUsername('');
                setNewEmail('');
                setNewPassword('');
                setNewRoleId(roles[0]?.id || '');
                setUserModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#67a623] to-[#548a1a] hover:from-[#5da01a] hover:to-[#4a7d14] text-white text-xs font-bold rounded-xl shadow-md shadow-[#67a623]/20 transition-all hover:shadow-lg hover:shadow-[#67a623]/30 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Crear Usuario</span>
            </button>
          )}
        </div>
      </div>

      {/* Alertas de Notificación */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center justify-between gap-3 text-rose-800 dark:text-rose-300 text-xs font-bold animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selector de Pestañas */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {canManageRoles && (
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'roles'
                ? 'border-[#67a623] text-[#548a1a] dark:text-[#afdd7a]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Roles del Sistema ({roles.length})</span>
          </button>
        )}

        {canAssignUsers && (
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-[#67a623] text-[#548a1a] dark:text-[#afdd7a]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Asignación de Usuarios ({users.length})</span>
          </button>
        )}
      </div>

      {/* Contenido Principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-[#67a623] animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Cargando información del sistema...</p>
        </div>
      ) : activeTab === 'roles' && canManageRoles ? (
        /* Pestaña: Roles del Sistema */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-5 relative overflow-hidden group"
            >
              <div className="space-y-4">
                {/* Cabecera del Rol */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {role.name}
                      </h3>
                      {role.isSystemRole && (
                        <span
                          title="Rol protegido del sistema"
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-full text-[10px] font-bold"
                        >
                          <Lock className="w-3 h-3" />
                          Sistema
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {role.description || 'Sin descripción detallada.'}
                    </p>
                  </div>
                </div>

                {/* Métricas del rol */}
                <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{role.usersCount} usuario(s)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#548a1a] dark:text-[#afdd7a]" />
                    <span>{role.permissions.length} permiso(s)</span>
                  </div>
                </div>

                {/* Lista de Permisos Resumida */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
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
              {canManageRoles && (
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
              )}
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

            {canAssignUsers && (
              <button
                onClick={() => {
                  setUserFormError(null);
                  setNewFullName('');
                  setNewUsername('');
                  setNewEmail('');
                  setNewPassword('');
                  setNewRoleId(roles[0]?.id || '');
                  setUserModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#67a623] to-[#548a1a] hover:from-[#5da01a] hover:to-[#4a7d14] text-white text-xs font-bold rounded-xl shadow-md shadow-[#67a623]/20 transition-all shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Crear Usuario</span>
              </button>
            )}
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
                        {canAssignUsers ? (
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
                        ) : (
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {u.roleName}
                          </span>
                        )}
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
                        {canAssignUsers ? (
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
                        ) : (
                          <span className="text-xs text-slate-400 italic">Solo lectura</span>
                        )}
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

      {/* Modal Crear Usuario */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 text-[#548a1a] rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Registrar Nuevo Usuario
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Crea una cuenta en el sistema y asígnale su rol institucional correspondiente.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {userFormError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{userFormError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="ej. Dra. María Rodríguez"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Usuario *
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="ej. mrodriguez"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="mrodriguez@academictrack.edu"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Contraseña Inicial *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Rol Institucional Inicial
                </label>
                <select
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#67a623]"
                >
                  <option value="">Seleccionar rol (por defecto: Docente)</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#67a623] to-[#548a1a] hover:from-[#5da01a] hover:to-[#4a7d14] text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {creatingUser && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{creatingUser ? 'Registrando...' : 'Registrar Usuario'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
