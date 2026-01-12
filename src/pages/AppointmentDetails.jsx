import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, PawPrint, User, Phone, Mail, MapPin, CreditCard, XCircle, ArrowLeft } from 'lucide-react';
import { appointmentsAPI } from '../services/api';
import { showToast } from '../components/Layout/Toast';
import Layout from '../components/Layout/Layout';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await appointmentsAPI.getOne(id);
      setAppointment(response.data.data.appointment);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      showToast('Failed to load appointment details', 'error');
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancelling(true);
    try {
      await appointmentsAPI.cancel(id);
      showToast('Appointment cancelled successfully', 'success');
      navigate('/appointments');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      showToast('Failed to cancel appointment', 'error');
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Loading appointment...</div>
        </div>
      </Layout>
    );
  }

  if (!appointment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Appointment not found</p>
          <Link
            to="/appointments"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Appointments
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/appointments"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Appointments</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Appointment Details
              </h1>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>
            {appointment.status === 'scheduled' && (
              <button
                onClick={handleCancelAppointment}
                disabled={cancelling}
                className="inline-flex items-center gap-2 px-6 py-3 text-red-600 border border-red-300 rounded-xl font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <XCircle size={20} />
                {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Appointment Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">{formatDate(appointment.appointmentDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-800">{appointment.appointmentTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Veterinarian</p>
                    <p className="font-semibold text-gray-800">Dr. {appointment.vet.name}</p>
                    {appointment.vet.specialization && (
                      <p className="text-sm text-gray-600">{appointment.vet.specialization}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-semibold text-gray-800">
                      {appointment.paymentMethod === 'pay_now' ? 'Paid Online' : 'Pay at Clinic'}
                    </p>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Reason for Visit</p>
                    <p className="text-gray-800">{appointment.reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pet Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pet Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <PawPrint size={28} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{appointment.pet.name}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                    <span className="capitalize">{appointment.pet.species}</span>
                    {appointment.pet.breed && (
                      <>
                        <span>•</span>
                        <span>{appointment.pet.breed}</span>
                      </>
                    )}
                    {appointment.pet.age && (
                      <>
                        <span>•</span>
                        <span>{appointment.pet.age} years old</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-400" />
                  <span className="text-gray-700">{appointment.user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-gray-700 text-sm">{appointment.user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-gray-700">{appointment.user.phone}</span>
                </div>
              </div>
            </div>

            {/* Clinic Info (Mock) */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Clinic Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">PawCare Veterinary Clinic</p>
                    <p className="text-gray-600">123 Pet Street, Animal City, AC 12345</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-600" />
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600">
                    Please arrive 10 minutes before your appointment time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentDetails;
