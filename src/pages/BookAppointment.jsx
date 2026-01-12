import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, PawPrint, CreditCard, CheckCircle, ChevronLeft } from 'lucide-react';
import { appointmentsAPI, petsAPI } from '../services/api';
import { showToast } from '../components/Layout/Toast';
import Layout from '../components/Layout/Layout';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pets, setPets] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    paymentMethod: 'pay_later',
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (formData.appointmentDate) {
      fetchAvailableSlots(formData.appointmentDate);
    }
  }, [formData.appointmentDate]);

  const fetchPets = async () => {
    try {
      const response = await petsAPI.getAll();
      setPets(response.data.data.pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
      showToast('Failed to load pets', 'error');
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await appointmentsAPI.getAvailableSlots(date);
      setAvailableSlots(response.data.data.availableSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      showToast('Failed to load available time slots', 'error');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.appointmentDate) {
          showToast('Please select a date', 'warning');
          return false;
        }
        if (!formData.appointmentTime) {
          showToast('Please select a time slot', 'warning');
          return false;
        }
        return true;
      case 2:
        if (!formData.petId) {
          showToast('Please select a pet', 'warning');
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await appointmentsAPI.create({
        petId: parseInt(formData.petId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason || null,
        paymentMethod: formData.paymentMethod,
      });

      showToast('Appointment booked successfully!', 'success');
      setStep(4); // Show confirmation

      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      showToast(error.response?.data?.message || 'Failed to book appointment', 'error');
    }
    setLoading(false);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const selectedPet = pets.find((p) => p.id === parseInt(formData.petId));

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-start">
              {[1, 2, 3].map((s, idx) => (
                <div key={s} className="flex-1 flex flex-col items-center relative">
                  {/* Step circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10
          ${step >= s ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                  >
                    {s}
                  </div>

                  {/* Connector line */}
                  {idx < 2 && (
                    <div
                      className={`absolute top-5 left-1/2 h-1
            ${step > s ? 'bg-blue-500' : 'bg-gray-200'}`}
                      style={{ width: '100%' }}
                    />
                  )}

                  {/* Label */}
                  <span
                    className={`mt-2 text-xs sm:text-sm text-center
          ${step >= s ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
                  >
                    {s === 1 && 'Date & Time'}
                    {s === 2 && 'Pet Info'}
                    {s === 3 && 'Payment'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Date & Time</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  // min={getMinDate()}
                  value={formData.appointmentDate}
                  onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>

              {formData.appointmentDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  {availableSlots.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No available slots for this date. Please select another date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleInputChange('appointmentTime', time)}
                          className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${formData.appointmentTime === time
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                            }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pet Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Pet
                  </label>
                  {pets.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't added any pets yet.</p>
                      <button
                        onClick={() => navigate('/pets/new')}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                      >
                        Add Your First Pet
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pets.map((pet) => (
                        <button
                          key={pet.id}
                          onClick={() => handleInputChange('petId', pet.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${formData.petId === pet.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <PawPrint size={24} className="text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{pet.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {pet.species} {pet.breed && `• ${pet.breed}`} {pet.age && `• ${pet.age} years old`}
                            </p>
                          </div>
                          {formData.petId === pet.id && (
                            <CheckCircle size={24} className="text-blue-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {pets.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit (Optional)
                    </label>
                    <textarea
                      rows="4"
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      placeholder="Describe the reason for your visit..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

              <div className="space-y-3 mb-8">
                {/* <button */}
                {/*   onClick={() => handleInputChange('paymentMethod', 'pay_now')} */}
                {/*   className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${formData.paymentMethod === 'pay_now' */}
                {/*     ? 'border-blue-500 bg-blue-50' */}
                {/*     : 'border-gray-200 hover:border-blue-300' */}
                {/*     }`} */}
                {/* > */}
                {/*   <div */}
                {/*     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'pay_now' */}
                {/*       ? 'border-blue-500 bg-blue-500' */}
                {/*       : 'border-gray-300' */}
                {/*       }`} */}
                {/*   > */}
                {/*     {formData.paymentMethod === 'pay_now' && ( */}
                {/*       <div className="w-3 h-3 rounded-full bg-white"></div> */}
                {/*     )} */}
                {/*   </div> */}
                {/*   <CreditCard className="text-gray-600" size={24} /> */}
                {/*   <div className="flex-1 text-left"> */}
                {/*     <h3 className="font-semibold text-gray-800">Pay Now Online</h3> */}
                {/*     <p className="text-sm text-gray-600">Secure payment with credit card</p> */}
                {/*   </div> */}
                {/* </button> */}

                <button
                  onClick={() => handleInputChange('paymentMethod', 'pay_later')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${formData.paymentMethod === 'pay_later'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'pay_later'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                      }`}
                  >
                    {formData.paymentMethod === 'pay_later' && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <Calendar className="text-gray-600" size={24} />
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-800">Pay at Clinic</h3>
                    <p className="text-sm text-gray-600">Pay when you arrive for your appointment</p>
                  </div>
                </button>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(formData.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-800">{formData.appointmentTime}</span>
                  </div>
                  {selectedPet && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pet:</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {selectedPet.name} ({selectedPet.species})
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium text-gray-800">
                      {formData.paymentMethod === 'pay_now' ? 'Pay Online' : 'Pay at Clinic'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                We've sent a confirmation email to your inbox. Redirecting to dashboard...
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
