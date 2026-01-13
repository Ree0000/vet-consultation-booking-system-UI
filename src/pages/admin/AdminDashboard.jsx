import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, PawPrint, CheckCircle, XCircle, Ban, Clock } from 'lucide-react';
import { adminAppointmentsAPI } from '../../services/adminApi';
import { showToast } from '../../components/Layout/Toast';
import AdminLayout from '../../components/Layout/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAppointmentsAPI.getStats();
      setStats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast('Gagal memuat statistik', 'error');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Memuat dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header Selamat Datang */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl shadow-lg p-6 sm:p-8 mb-6 text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-blue-100">Kelola janji temu, dokter hewan, dan pengguna</p>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-800">{stats?.today || 0}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Janji Temu Hari Ini</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-amber-600" />
            </div>
            <span className="text-3xl font-bold text-gray-800">{stats?.scheduled || 0}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Terjadwalkan</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-800">{stats?.completed || 0}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Selesai</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
            <span className="text-3xl font-bold text-gray-800">{stats?.noShows || 0}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Tidak Hadir</p>
        </div>
      </div>

      {/* Statistik Sekunder */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users size={28} className="text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
              <p className="text-gray-600 text-sm">Total Pengguna</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
              <PawPrint size={28} className="text-pink-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalPets || 0}</p>
              <p className="text-gray-600 text-sm">Total Hewan Peliharaan</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
              <Ban size={28} className="text-gray-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{stats?.cancelled || 0}</p>
              <p className="text-gray-600 text-sm">Dibatalkan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/appointments"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors group"
          >
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={32} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800">Lihat Janji Temu</span>
          </Link>

          <Link
            to="/admin/veterinarians"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-cyan-50 hover:bg-cyan-100 transition-colors group"
          >
            <div className="w-16 h-16 bg-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle size={32} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800">Kelola Dokter Hewan</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors group"
          >
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={32} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800">Kelola Pengguna</span>
          </Link>

          <Link
            to="/admin/appointments?status=scheduled"
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-amber-50 hover:bg-amber-100 transition-colors group"
          >
            <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={32} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800">Jadwal Hari Ini</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
