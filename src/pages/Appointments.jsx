import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, PawPrint, Plus, Eye, XCircle } from 'lucide-react';
import { appointmentsAPI } from '../services/api';
import { showToast } from '../components/Layout/Toast';
import Layout from '../components/Layout/Layout';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, activeFilter]);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data.data.appointments);
      setLoading(false);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil janji temu:', error);
      showToast('Gagal memuat janji temu', 'error');
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    const now = new Date();
    let filtered = [];

    switch (activeFilter) {
      case 'upcoming':
        filtered = appointments.filter((apt) => {
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
        break;
      case 'past':
        filtered = appointments.filter((apt) => {
          const aptDate = new Date(apt.appointmentDate);
          const [hours, minutes] = apt.appointmentTime.split(':').map(Number);

          const aptDateTime = new Date(
            aptDate.getFullYear(),
            aptDate.getMonth(),
            aptDate.getDate(),
            hours,
            minutes
          );

          return aptDateTime < now || apt.status === 'completed';
        });
        break;
      case 'cancelled':
        filtered = appointments.filter((apt) => apt.status === 'cancelled');
        break;
      default:
        filtered = appointments;
    }

    setFilteredAppointments(
      filtered.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
    );
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan janji temu ini?')) {
      return;
    }

    setCancellingId(id);
    try {
      await appointmentsAPI.cancel(id);
      showToast('Janji temu berhasil dibatalkan', 'success');
      fetchAppointments();
    } catch (error) {
      console.error('Terjadi kesalahan saat membatalkan janji temu:', error);
      showToast('Gagal membatalkan janji temu', 'error');
    }
    setCancellingId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      hari: 'short',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    const labels = {
      scheduled: 'Terjadwal',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'
          }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Memuat janji temu...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Janji Temu Saya
          </h1>
          <Link
            to="/appointments/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Calendar size={20} />
            <span>Buat Janji Baru</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { key: 'upcoming', label: 'Mendatang' },
          { key: 'past', label: 'Sebelumnya' },
          { key: 'cancelled', label: 'Dibatalkan' },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-6 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${activeFilter === filter.key
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Tidak ada janji temu saat ini{/*activeFilter*/}
          </h3>
          <p className="text-gray-500 mb-4">
            {activeFilter === 'upcoming'
              ? 'Anda belum memiliki janji temu mendatang.'
              : activeFilter === 'past'
                ? 'Anda tidak memiliki janji temu yang telah lewat.'
                : activeFilter === 'cancelled'
                  ? 'Anda tidak memiliki janji temu yang dibatalkan.'
                  : 'Anda tidak memiliki janji temu.'}
          </p>
          {activeFilter === 'upcoming' && (
            <Link
              to="/appointments/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              Buat Janji Temu
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <PawPrint size={28} className="text-blue-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {appointment.pet.name} - Pemeriksaan Umum
                      </h3>
                      <p className="text-sm text-gray-600">Dr. {appointment.vet.name}</p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PawPrint size={16} />
                      <span className="capitalize">{appointment.pet.species}</span>
                    </div>
                  </div>

                  {appointment.reason && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      <span className="font-medium">Alasan:</span> {appointment.reason}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Eye size={16} />
                      Lihat Detail
                    </Link>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={cancellingId === appointment.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        {cancellingId === appointment.id ? 'Membatalkan...' : 'Batalkan'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Appointments;
