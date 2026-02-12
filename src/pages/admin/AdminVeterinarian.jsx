import React, { useState, useEffect } from 'react';
import { Stethoscope, Plus, Edit, Trash2, Power, Save, X, Calendar, Clock } from 'lucide-react';
import { adminVeterinariansAPI, adminAppointmentsAPI } from '../../services/adminApi';
import { showToast } from '../../components/Layout/Toast';
import AdminLayout from '../../components/Layout/AdminLayout';

const AdminVeterinarians = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingVet, setEditingVet] = useState(null);
  const [selectedVetForBooking, setSelectedVetForBooking] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    available: true
  });
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      const response = await adminVeterinariansAPI.getAll();
      setVets(response.data.data.veterinarians);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vets:', error);
      showToast('Gagal memuat dokter hewan', 'error');
      setLoading(false);
    }
  };

  const handleOpenModal = (vet = null) => {
    if (vet) {
      setEditingVet(vet);
      setFormData({
        name: vet.name,
        specialization: vet.specialization || '',
        available: vet.available
      });
    } else {
      setEditingVet(null);
      setFormData({
        name: '',
        specialization: '',
        available: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVet(null);
    setFormData({ name: '', specialization: '', available: true });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast('Harap masukkan nama dokter hewan', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingVet) {
        await adminVeterinariansAPI.update(editingVet.id, formData);
        showToast('Dokter hewan berhasil diperbarui', 'success');
      } else {
        await adminVeterinariansAPI.create(formData);
        showToast('Dokter hewan berhasil ditambahkan', 'success');
      }
      fetchVets();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving vet:', error);
      showToast(error.response?.data?.message || 'Gagal menyimpan dokter hewan', 'error');
    }
    setSaving(false);
  };

  const handleToggleAvailability = async (id) => {
    setTogglingId(id);
    try {
      await adminVeterinariansAPI.toggleAvailability(id);
      showToast('Ketersediaan diperbarui', 'success');
      fetchVets();
    } catch (error) {
      console.error('Error toggling availability:', error);
      showToast('Gagal memperbarui ketersediaan', 'error');
    }
    setTogglingId(null);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus Dr. ${name}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      await adminVeterinariansAPI.delete(id);
      showToast('Dokter hewan berhasil dihapus', 'success');
      fetchVets();
    } catch (error) {
      console.error('Error deleting vet:', error);
      showToast(error.response?.data?.message || 'Gagal menghapus dokter hewan', 'error');
    }
  };

  const handleOpenBookingModal = (vet) => {
    setSelectedVetForBooking(vet);
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedVetForBooking(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Memuat dokter hewan...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Dokter Hewan</h1>
            <p className="text-gray-500">Kelola tim dokter hewan Anda</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Tambah Dokter Hewan
          </button>
        </div>
      </div>

      {/* Grid Dokter Hewan */}
      {vets.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <Stethoscope size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada dokter hewan ditambahkan</h3>
          <p className="text-gray-500 mb-6">Tambahkan dokter hewan pertama Anda untuk memulai</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Tambah Dokter Hewan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vets.map((vet) => (
            <div
              key={vet.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <Stethoscope size={28} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Dr. {vet.name}</h3>
                    {vet.specialization && (
                      <p className="text-sm text-gray-600">{vet.specialization}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Badge Ketersediaan */}
              <div className="mb-4">
                {vet.available ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Tersedia
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Tidak Tersedia
                  </span>
                )}
              </div>

              {/* Aksi */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenBookingModal(vet)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-50 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  <Calendar size={16} />
                  Booking
                </button>
                <button
                  onClick={() => handleToggleAvailability(vet.id)}
                  disabled={togglingId === vet.id}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <Power size={16} />
                  {togglingId === vet.id ? '...' : ''}
                </button>
                <button
                  onClick={() => handleOpenModal(vet)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(vet.id, vet.name)}
                  className="flex items-center justify-center px-3 py-2 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit Dokter Hewan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingVet ? 'Edit Dokter Hewan' : 'Tambah Dokter Hewan'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="contoh: Sarah Johnson"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spesialisasi (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="contoh: Hewan Kecil, Bedah"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="available" className="text-sm font-medium text-gray-700">
                  Tersedia untuk janji temu
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Menyimpan...' : editingVet ? 'Perbarui' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Modal */}
      {showBookingModal && selectedVetForBooking && (
        <ManualBookingModal
          vet={selectedVetForBooking}
          onClose={handleCloseBookingModal}
        />
      )}
    </AdminLayout>
  );
};

// Manual Booking Modal Component
const ManualBookingModal = ({ vet, onClose }) => {
  const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Details
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingType, setBookingType] = useState('offline'); // 'offline' or 'blocked'
  const [formData, setFormData] = useState({
    offlineClientName: '',
    offlineClientPhone: '',
    offlinePetName: '',
    offlinePetType: '',
    adminNotes: ''
  });
  const [saving, setSaving] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await adminAppointmentsAPI.getAvailableSlots(selectedDate, vet.id);
      setAvailableSlots(response.data.data.availableSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      showToast('Gagal memuat slot waktu', 'error');
      setAvailableSlots([]);
    }
    setLoadingSlots(false);
  };

  const handleDateSelect = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async () => {
    // Validation
    if (bookingType === 'offline') {
      if (!formData.offlineClientName || !formData.offlineClientPhone ||
        !formData.offlinePetName || !formData.offlinePetType) {
        showToast('Harap lengkapi semua data klien untuk booking offline', 'warning');
        return;
      }
    }

    setSaving(true);
    try {
      const bookingData = {
        vetId: vet.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        bookingType,
        ...(bookingType === 'offline' && {
          offlineClientName: formData.offlineClientName,
          offlineClientPhone: formData.offlineClientPhone,
          offlinePetName: formData.offlinePetName,
          offlinePetType: formData.offlinePetType,
        }),
        adminNotes: formData.adminNotes || null
      };

      await adminAppointmentsAPI.createManual(bookingData);
      showToast(
        bookingType === 'offline'
          ? 'Booking offline berhasil dibuat'
          : 'Slot berhasil diblokir',
        'success'
      );
      onClose();
    } catch (error) {
      console.error('Error creating manual booking:', error);
      showToast(error.response?.data?.message || 'Gagal membuat booking', 'error');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Manual Booking</h3>
            <p className="text-sm text-gray-600">Dr. {vet.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Select Date */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-4">Pilih Tanggal</h4>
            <input
              type="date"
              value={selectedDate}
              min={getTodayDate()}
              onChange={handleDateSelect}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            />
          </div>
        )}

        {/* Step 2: Select Time */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Pilih Waktu</h4>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Ubah Tanggal
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            {loadingSlots ? (
              <div className="text-center py-8 text-gray-500">Memuat slot...</div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada slot tersedia untuk tanggal ini
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className="px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Booking Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Detail Booking</h4>
              <button
                onClick={() => setStep(2)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Ubah Waktu
              </button>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-blue-600" />
                <span className="text-gray-700">
                  {new Date(selectedDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-blue-600" />
                <span className="text-gray-700">{selectedTime}</span>
              </div>
            </div>

            {/* Booking Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipe Booking <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setBookingType('offline')}
                  className={`p-4 rounded-xl border-2 transition-all ${bookingType === 'offline'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="font-semibold text-gray-800 mb-1">Booking Offline</div>
                  <div className="text-xs text-gray-600">Klien walk-in atau telepon</div>
                </button>
                <button
                  onClick={() => setBookingType('blocked')}
                  className={`p-4 rounded-xl border-2 transition-all ${bookingType === 'blocked'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="font-semibold text-gray-800 mb-1">Blokir Slot</div>
                  <div className="text-xs text-gray-600">Operasi, rapat, istirahat</div>
                </button>
              </div>
            </div>

            {/* Offline Client Details */}
            {bookingType === 'offline' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h5 className="font-semibold text-gray-800">Data Klien</h5>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pemilik <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.offlineClientName}
                      onChange={(e) => setFormData({ ...formData, offlineClientName: e.target.value })}
                      placeholder="Nama lengkap"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.offlineClientPhone}
                      onChange={(e) => setFormData({ ...formData, offlineClientPhone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Hewan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.offlinePetName}
                      onChange={(e) => setFormData({ ...formData, offlinePetName: e.target.value })}
                      placeholder="contoh: Fluffy"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Hewan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.offlinePetType}
                      onChange={(e) => setFormData({ ...formData, offlinePetType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    >
                      <option value="">Pilih jenis</option>
                      <option value="dog">Anjing</option>
                      <option value="cat">Kucing</option>
                      <option value="rabbit">Kelinci</option>
                      <option value="bird">Burung</option>
                      <option value="hamster">Hamster</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Admin (Opsional)
              </label>
              <textarea
                value={formData.adminNotes}
                onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                placeholder={bookingType === 'blocked' ? 'contoh: Operasi Caesar' : 'Catatan tambahan...'}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : bookingType === 'offline' ? 'Buat Booking' : 'Blokir Slot'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVeterinarians;
