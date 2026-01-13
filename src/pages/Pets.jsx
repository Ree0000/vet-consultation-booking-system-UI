import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Plus, Edit, Trash2 } from 'lucide-react';
import { petsAPI } from '../services/api';
import { showToast } from '../components/Layout/Toast';
import Layout from '../components/Layout/Layout';

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await petsAPI.getAll();
      setPets(response.data.data.pets);
      setLoading(false);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data hewan:', error);
      showToast('Gagal memuat data hewan', 'error');
      setLoading(false);
    }
  };

  const handleDeletePet = async (id, name) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus ${name}? Tindakan ini juga akan membatalkan semua janji temu yang terkait.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      await petsAPI.delete(id);
      showToast(`${name} berhasil dihapus`, 'success');
      fetchPets();
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus hewan:', error);
      showToast('Gagal menghapus hewan', 'error');
    }
    setDeletingId(null);
  };

  const getPetIcon = (species) => {
    const icons = {
      anjing: '🐕',
      kucing: '🐈',
      kelinci: '🐰',
      burung: '🐦',
      hamster: '🐹',
      ikan: '🐠',
      ular: '🐍',
      kadal: '🦎',
      kuda: '🐴',
      guinea: '🐹',
      musang: '🦡',
    };

    const speciesLower = species.toLowerCase();
    for (const [key, emoji] of Object.entries(icons)) {
      if (speciesLower.includes(key)) {
        return emoji;
      }
    }
    return '🐾';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Memuat data hewan...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              Hewan Peliharaan Saya
            </h1>
            <p className="text-gray-500">
              Kelola hewan peliharaan kesayangan Anda
            </p>
          </div>
          <Link
            to="/pets/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            <span>Tambah Hewan Baru</span>
          </Link>
        </div>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <PawPrint size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Belum ada hewan yang ditambahkan
          </h3>
          <p className="text-gray-500 mb-6">
            Tambahkan hewan peliharaan pertama Anda untuk mulai membuat janji temu
          </p>
          <Link
            to="/pets/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Tambah Hewan Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
            >
              {/* Pet Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center text-3xl">
                    {getPetIcon(pet.species)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {pet.species}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pet Details */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                {pet.breed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ras:</span>
                    <span className="font-medium text-gray-800">
                      {pet.breed}
                    </span>
                  </div>
                )}
                {pet.age && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Usia:</span>
                    <span className="font-medium text-gray-800">
                      {pet.age} tahun
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ditambahkan:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(pet.createdAt).toLocaleDateString('id-ID', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/pets/edit/${pet.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </Link>
                <button
                  onClick={() => handleDeletePet(pet.id, pet.name)}
                  disabled={deletingId === pet.id}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {deletingId === pet.id ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Pets;
