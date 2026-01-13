import React, { useState, useEffect } from 'react';
import { Calendar, Clock, PawPrint, User, CheckCircle, XCircle, Ban, Search, Filter } from 'lucide-react';
import { adminAppointmentsAPI } from '../../services/adminApi';
import { showToast } from '../../components/Layout/Toast';
import AdminLayout from '../../components/Layout/AdminLayout';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter, dateFilter, searchTerm]);

  const fetchAppointments = async () => {
    try {
      const response = await adminAppointmentsAPI.getAll();
      setAppointments(response.data.data.appointments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showToast('Gagal memuat janji temu', 'error');
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filter tanggal
    if (dateFilter) {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate).toISOString().split('T')[0];
        return aptDate === dateFilter;
      });
    }

    // Filter pencarian
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.user.name.toLowerCase().includes(search) ||
        apt.pet.name.toLowerCase().includes(search) ||
        apt.user.email.toLowerCase().includes(search)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const statusMessages = {
      'completed': 'selesai',
      'no-show': 'tidak hadir',
      'cancelled': 'dibatalkan'
    };

    if (!window.confirm(`Apakah Anda yakin ingin menandai janji temu ini sebagai ${statusMessages[newStatus]}?`)) {
      return;
    }

    setUpdatingId(id);
    try {
      await adminAppointmentsAPI.updateStatus(id, newStatus);
      showToast(`Janji temu ditandai sebagai ${statusMessages[newStatus]}`, 'success');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Gagal memperbarui status janji temu', 'error');
    }
    setUpdatingId(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-amber-100 text-amber-700 border-amber-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
      'no-show': 'bg-red-100 text-red-700 border-red-200',
    };

    const labels = {
      scheduled: 'Terjadwal',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      'no-show': 'Tidak Hadir',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Memuat janji temu...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Manajemen Janji Temu</h1>

        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pencarian */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, hewan, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            />
          </div>

          {/* Filter Tanggal */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none"
            >
              <option value="all">Semua Status</option>
              <option value="scheduled">Terjadwal</option>
              <option value="completed">Selesai</option>
              <option value="no-show">Tidak Hadir</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>

        {/* Jumlah Hasil */}
        <div className="mt-4 text-sm text-gray-600">
          Menampilkan {filteredAppointments.length} dari {appointments.length} janji temu
        </div>
      </div>

      {/* Daftar Janji Temu */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak ada janji temu ditemukan</h3>
          <p className="text-gray-500">Coba sesuaikan filter Anda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Info Hewan & Pengguna */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PawPrint size={28} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {appointment.pet.name} - Pemeriksaan Umum
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User size={16} />
                        <span>{appointment.user.name}</span>
                        <span>•</span>
                        <span>{appointment.user.email}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Alasan:</span> {appointment.reason}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Dokter Hewan:</span> Dr. {appointment.vet.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Aksi */}
                {appointment.status === 'scheduled' && (
                  <div className="flex flex-col gap-2 lg:w-48">
                    <button
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                      disabled={updatingId === appointment.id}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      {updatingId === appointment.id ? 'Memperbarui...' : 'Selesai'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appointment.id, 'no-show')}
                      disabled={updatingId === appointment.id}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Tidak Hadir
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      disabled={updatingId === appointment.id}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Ban size={16} />
                      Batalkan
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAppointments;
