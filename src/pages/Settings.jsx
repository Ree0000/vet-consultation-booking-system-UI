import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Trash2, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, usersAPI } from '../services/api';
import { showToast } from '../components/Layout/Toast';
import Layout from '../components/Layout/Layout';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!profileData.name || !profileData.email || !profileData.phone) {
      showToast('Harap isi semua kolom', 'warning');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await usersAPI.updateProfile(profileData);
      showToast('Profil berhasil diperbarui!', 'success');

      const updatedUser = response.data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      window.location.reload();
    } catch (error) {
      console.error('Terjadi kesalahan saat memperbarui profil:', error);
      showToast(error.response?.data?.message || 'Gagal memperbarui profil', 'error');
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('Harap isi semua kolom kata sandi', 'warning');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Kata sandi baru harus minimal 6 karakter', 'warning');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Kata sandi baru tidak cocok', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      showToast('Kata sandi berhasil diubah!', 'success');

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Terjadi kesalahan saat mengubah kata sandi:', error);
      showToast(error.response?.data?.message || 'Gagal mengubah kata sandi', 'error');
    }
    setPasswordLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      showToast('Ketik DELETE untuk mengonfirmasi', 'warning');
      return;
    }

    setDeleteLoading(true);
    try {
      await usersAPI.deleteAccount();
      showToast('Akun berhasil dihapus', 'success');

      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus akun:', error);
      showToast(error.response?.data?.message || 'Gagal menghapus akun', 'error');
      setDeleteLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pengaturan</h1>
          <p className="text-gray-500">Kelola pengaturan dan preferensi akun Anda</p>
        </div>

        <div className="space-y-6">
          {/* Profile Information Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Informasi Profil</h2>
                <p className="text-sm text-gray-500">Perbarui data pribadi Anda</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleProfileUpdate}
                disabled={profileLoading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save size={20} />
                {profileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Lock size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Ubah Kata Sandi</h2>
                <p className="text-sm text-gray-500">
                  Perbarui kata sandi untuk menjaga keamanan akun Anda
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kata Sandi Saat Ini
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    placeholder="Masukkan kata sandi saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    placeholder="Masukkan kata sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimal 6 karakter
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    placeholder="Konfirmasi kata sandi baru"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handlePasswordChange}
                disabled={passwordLoading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Lock size={20} />
                {passwordLoading ? 'Mengubah...' : 'Ubah Kata Sandi'}
              </button>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-red-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Hapus Akun</h2>
                <p className="text-sm text-red-600">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Peringatan:</strong> Menghapus akun Anda akan menghilangkan secara permanen:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                <li>Semua informasi pribadi Anda</li>
                <li>Semua hewan peliharaan yang terdaftar</li>
                <li>Seluruh riwayat janji temu</li>
                <li>Akses ke akun Anda</li>
              </ul>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              <Trash2 size={20} />
              Hapus Akun Saya
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Konfirmasi Penghapusan Akun
            </h3>
            <p className="text-gray-600 mb-4">
              Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Semua data Anda akan dihapus.
            </p>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Ketik <span className="font-bold text-red-600">DELETE</span> untuk mengonfirmasi:
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all outline-none mb-4"
              placeholder="Ketik DELETE"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmation !== 'DELETE'}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Menghapus...' : 'Hapus Akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Settings;
