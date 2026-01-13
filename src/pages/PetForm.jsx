import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PawPrint, ArrowLeft } from 'lucide-react';
import { petsAPI } from '../services/api';
import { showToast } from '../components/Layout/Toast';
import Layout from '../components/Layout/Layout';

const PetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'anjing',
    customSpecies: '',
    breed: '',
    age: '',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchPet();
    }
  }, [id]);

  const fetchPet = async () => {
    try {
      const response = await petsAPI.getOne(id);
      const pet = response.data.data.pet;
      const isCustomSpecies = !['anjing', 'kucing'].includes(pet.species);
      setFormData({
        name: pet.name,
        species: isCustomSpecies ? 'other' : pet.species,
        customSpecies: isCustomSpecies ? pet.species : '',
        breed: pet.breed || '',
        age: pet.age || '',
      });
    } catch (error) {
      console.error('Error fetching pet:', error);
      showToast('Gagal memuat detail hewan peliharaan', 'error');
      navigate('/pets');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.species) {
      showToast('Harap isi semua kolom yang wajib diisi', 'warning');
      return;
    }

    if (formData.species === 'other' && !formData.customSpecies.trim()) {
      showToast('Harap tentukan spesies hewan', 'warning');
      return;
    }

    setLoading(true);
    try {
      const finalSpecies = formData.species === 'other'
        ? formData.customSpecies.trim().toLowerCase()
        : formData.species;

      const petData = {
        name: formData.name,
        species: finalSpecies,
        breed: formData.breed || null,
        age: formData.age ? parseInt(formData.age) : null,
      };

      if (isEditMode) {
        await petsAPI.update(id, petData);
        showToast('Hewan peliharaan berhasil diperbarui!', 'success');
      } else {
        await petsAPI.create(petData);
        showToast('Hewan peliharaan berhasil ditambahkan!', 'success');
      }

      navigate('/pets');
    } catch (error) {
      console.error('Error saving pet:', error);
      showToast(error.response?.data?.message || 'Gagal menyimpan hewan peliharaan', 'error');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Tombol Kembali */}
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Hewan Peliharaan</span>
        </Link>

        {/* Kartu Formulir */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PawPrint size={32} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {isEditMode ? 'Edit Hewan Peliharaan' : 'Tambah Hewan Peliharaan Baru'}
            </h1>
            <p className="text-gray-500">
              {isEditMode ? 'Perbarui informasi hewan peliharaan Anda' : 'Daftarkan hewan peliharaan kesayangan Anda'}
            </p>
          </div>

          {/* Formulir */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Hewan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="contoh: Max, Luna, Buddy"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spesies <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('species', 'anjing')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.species === 'anjing'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <span className="text-3xl">🐕</span>
                  <span className="font-semibold text-gray-800 text-sm">Anjing</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('species', 'kucing')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.species === 'kucing'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <span className="text-3xl">🐈</span>
                  <span className="font-semibold text-gray-800 text-sm">Kucing</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('species', 'other')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.species === 'other'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <span className="text-3xl">🐾</span>
                  <span className="font-semibold text-gray-800 text-sm">Lainnya</span>
                </button>
              </div>

              {formData.species === 'other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.customSpecies}
                    onChange={(e) => handleInputChange('customSpecies', e.target.value)}
                    placeholder="Masukkan spesies hewan (contoh: kelinci, burung, hamster)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Tentukan jenis hewan apa</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ras (Opsional)
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                placeholder="contoh: Golden Retriever, Persian"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usia dalam Tahun (Opsional)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="contoh: 3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
            </div>

            {/* Tombol Submit */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (isEditMode ? 'Memperbarui...' : 'Menambahkan...')
                  : (isEditMode ? 'Perbarui Hewan' : 'Tambah Hewan')}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              <span className="text-red-500">*</span> Kolom wajib diisi
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PetForm;
