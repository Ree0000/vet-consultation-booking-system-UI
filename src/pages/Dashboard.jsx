import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PawPrint, CheckCircle, ChevronRight, Clock, Plus } from 'lucide-react';
import { appointmentsAPI, petsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    total: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, petsRes] = await Promise.all([
        appointmentsAPI.getAll(),
        petsAPI.getAll(),
      ]);

      const allAppointments = appointmentsRes.data.data.appointments;
      setPets(petsRes.data.data.pets);

      const now = new Date();
      const upcoming = allAppointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        const [hours, minutes] = apt.appointmentTime.split(':').map(Number);

        const aptDateTime = new Date(
          aptDate.getFullYear(),
          aptDate.getMonth(),
          aptDate.getDate(),
          hours,
          minutes
        );

        return aptDateTime >= now && apt.status === 'scheduled';
      });

      setAppointments(upcoming.slice(0, 3));

      setStats({
        upcoming: upcoming.length,
        total: petsRes.data.data.pets.length,
        completed: allAppointments.filter((apt) => apt.status === 'completed').length,
      });

      setLoading(false);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Hari Ini';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Besok';
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Memuat dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              Selamat datang kembali, {user?.name}! 👋
            </h1>
            <p className="text-gray-500">Mari kita rawat hewan peliharaanmu hari ini</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Calendar size={28} />
            <span className="text-4xl font-bold">{stats.upcoming}</span>
          </div>
          <p className="text-blue-100 text-sm">Janji Temu Mendatang</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <PawPrint size={28} />
            <span className="text-4xl font-bold">{stats.total}</span>
          </div>
          <p className="text-cyan-100 text-sm">Hewan Terdaftar</p>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle size={28} />
            <span className="text-4xl font-bold">{stats.completed}</span>
          </div>
          <p className="text-amber-100 text-sm">Kunjungan Selesai</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/appointments/new"
            className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Calendar size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Buat Janji Temu</h3>
              <p className="text-sm text-gray-500">Jadwalkan pemeriksaan</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          </Link>

          <Link
            to="/pets/new"
            className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors group"
          >
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <PawPrint size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Tambah Hewan Baru</h3>
              <p className="text-sm text-gray-500">Daftarkan hewan peliharaanmu</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-cyan-500 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Janji Temu Mendatang</h2>
          <Link
            to="/appointments"
            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            Lihat Semua
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Belum ada janji temu mendatang</p>
            <Link
              to="/appointments/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              Buat Janji Temu Pertama
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <Link
                key={appointment.id}
                to={`/appointments/${appointment.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-md transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <PawPrint size={28} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {appointment.pet.name} - Pemeriksaan Umum
                  </h3>
                  <p className="text-sm text-gray-600">Dr. {appointment.vet.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="text-blue-600 font-medium flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(appointment.appointmentDate)}
                    </span>
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock size={14} />
                      {appointment.appointmentTime}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
