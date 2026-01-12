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
    species: 'dog',
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
      const isCustomSpecies = !['dog', 'cat'].includes(pet.species);
      setFormData({
        name: pet.name,
        species: isCustomSpecies ? 'other' : pet.species,
        customSpecies: isCustomSpecies ? pet.species : '',
        breed: pet.breed || '',
        age: pet.age || '',
      });
    } catch (error) {
      console.error('Error fetching pet:', error);
      showToast('Failed to load pet details', 'error');
      navigate('/pets');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.species) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    if (formData.species === 'other' && !formData.customSpecies.trim()) {
      showToast('Please specify the animal species', 'warning');
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
        showToast('Pet updated successfully!', 'success');
      } else {
        await petsAPI.create(petData);
        showToast('Pet added successfully!', 'success');
      }

      navigate('/pets');
    } catch (error) {
      console.error('Error saving pet:', error);
      showToast(error.response?.data?.message || 'Failed to save pet', 'error');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Pets</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PawPrint size={32} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {isEditMode ? 'Edit Pet' : 'Add New Pet'}
            </h1>
            <p className="text-gray-500">
              {isEditMode ? 'Update your pet information' : 'Register your furry family member'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Max, Luna, Buddy"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Species <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('species', 'dog')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.species === 'dog'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <span className="text-3xl">🐕</span>
                  <span className="font-semibold text-gray-800 text-sm">Dog</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('species', 'cat')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.species === 'cat'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <span className="text-3xl">🐈</span>
                  <span className="font-semibold text-gray-800 text-sm">Cat</span>
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
                  <span className="font-semibold text-gray-800 text-sm">Other</span>
                </button>
              </div>

              {formData.species === 'other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.customSpecies}
                    onChange={(e) => handleInputChange('customSpecies', e.target.value)}
                    placeholder="Enter animal species (e.g., rabbit, bird, hamster)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Specify what type of animal</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breed (Optional)
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                placeholder="e.g., Golden Retriever, Persian"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age in Years (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="e.g., 3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (isEditMode ? 'Updating...' : 'Adding...')
                  : (isEditMode ? 'Update Pet' : 'Add Pet')}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              <span className="text-red-500">*</span> Required fields
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PetForm;
