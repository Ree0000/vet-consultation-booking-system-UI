import React, { useState, useEffect } from 'react';
import { Users, Search, Edit, Key, Eye, X, Save, Mail, Phone, User, PawPrint, Calendar } from 'lucide-react';
import { adminUsersAPI } from '../../services/adminApi';
import { showToast } from '../../components/Layout/Toast';
import AdminLayout from '../../components/Layout/AdminLayout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await adminUsersAPI.getAll();
      setUsers(response.data.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Gagal memuat pengguna', 'error');
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phone.toLowerCase().includes(search)
    );
    setFilteredUsers(filtered);
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await adminUsersAPI.getOne(userId);
      setSelectedUser(response.data.data.user);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      showToast('Gagal memuat detail pengguna', 'error');
    }
  };

  const handleOpenEditModal = (user) => {
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
    setEditFormData({ name: '', email: '', phone: '' });
  };

  const handleUpdateUser = async () => {
    if (!editFormData.name || !editFormData.email || !editFormData.phone) {
      showToast('Harap isi semua kolom', 'warning');
      return;
    }

    setSaving(true);
    try {
      await adminUsersAPI.update(selectedUser.id, editFormData);
      showToast('Pengguna berhasil diperbarui', 'success');
      fetchUsers();
      handleCloseModals();
    } catch (error) {
      console.error('Error updating user:', error);
      showToast(error.response?.data?.message || 'Gagal memperbarui pengguna', 'error');
    }
    setSaving(false);
  };

  const handleResetPassword = async (userId, userName) => {
    if (!window.confirm(`Kirim email reset kata sandi ke ${userName}?`)) {
      return;
    }

    setResettingPassword(userId);
    try {
      await adminUsersAPI.resetPassword(userId);
      showToast('Email reset kata sandi berhasil dikirim', 'success');
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast(error.response?.data?.message || 'Gagal mereset kata sandi', 'error');
    }
    setResettingPassword(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Memuat pengguna...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Manajemen Pengguna</h1>

        {/* Pencarian */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Menampilkan {filteredUsers.length} dari {users.length} pengguna
        </div>
      </div>

      {/* Daftar Pengguna */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <Users size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak ada pengguna ditemukan</h3>
          <p className="text-gray-500">Coba sesuaikan pencarian Anda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User size={28} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg truncate">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Mail size={14} />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Phone size={14} />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <PawPrint size={12} />
                      {user._count?.pets || 0} hewan
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {user._count?.appointments || 0} janji temu
                    </span>
                  </div>
                </div>
              </div>

              {/* Aksi */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleViewDetails(user.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <Eye size={16} />
                  Lihat
                </button>
                <button
                  onClick={() => handleOpenEditModal(user)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleResetPassword(user.id, user.name)}
                  disabled={resettingPassword === user.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-amber-600 text-sm font-medium hover:bg-amber-50 transition-colors disabled:opacity-50"
                >
                  <Key size={16} />
                  {resettingPassword === user.id ? '...' : 'Reset'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Detail Pengguna</h3>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Info Pengguna */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Informasi Pribadi</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-medium text-gray-800">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telepon:</span>
                  <span className="font-medium text-gray-800">{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bergabung:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(selectedUser.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Hewan Peliharaan */}
            {selectedUser.pets && selectedUser.pets.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Hewan Peliharaan ({selectedUser.pets.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedUser.pets.map((pet) => (
                    <div key={pet.id} className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <PawPrint size={16} className="text-blue-600" />
                        <span className="font-medium text-gray-800">{pet.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 capitalize">
                        {pet.species} {pet.breed && `• ${pet.breed}`} {pet.age && `• ${pet.age} tahun`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Janji Temu */}
            {selectedUser.appointments && selectedUser.appointments.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Janji Temu Terbaru ({selectedUser.appointments.slice(0, 5).length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedUser.appointments.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{apt.pet.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            apt.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {apt.status === 'completed' ? 'Selesai' :
                            apt.status === 'scheduled' ? 'Terjadwal' :
                              apt.status === 'cancelled' ? 'Dibatalkan' :
                                apt.status === 'no-show' ? 'Tidak Hadir' : apt.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(apt.appointmentDate).toLocaleDateString('id-ID')} • {apt.appointmentTime}
                      </p>
                      <p className="text-sm text-gray-600">Dr. {apt.vet.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Pengguna</h3>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModals}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Menyimpan...' : 'Perbarui'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
