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
      console.error('Error fetching appointments:', error);
      showToast('Failed to load appointments', 'error');
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

          // Create full datetime for comparison
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

          // Create full datetime for comparison
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

    setFilteredAppointments(filtered.sort((a, b) =>
      new Date(b.appointmentDate) - new Date(a.appointmentDate)
    ));
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancellingId(id);
    try {
      await appointmentsAPI.cancel(id);
      showToast('Appointment cancelled successfully', 'success');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      showToast('Failed to cancel appointment', 'error');
    }
    setCancellingId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-blue-600 text-xl">Loading appointments...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Appointments</h1>
          <Link
            to="/appointments/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Calendar size={20} />
            <span>Book New</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'past', label: 'Past' },
          { key: 'cancelled', label: 'Cancelled' },
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
            No {activeFilter} appointments
          </h3>
          <p className="text-gray-500 mb-6">
            {activeFilter === 'upcoming'
              ? "You don't have any upcoming appointments scheduled."
              : `You don't have any ${activeFilter} appointments.`}
          </p>
          {activeFilter === 'upcoming' && (
            <Link
              to="/appointments/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              Book an Appointment
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
                {/* Pet Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <PawPrint size={28} className="text-blue-500" />
                </div>

                {/* Appointment Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {appointment.pet.name} - General Checkup
                      </h3>
                      <p className="text-sm text-gray-600">Dr. {appointment.vet.name}</p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} className="flex-shrink-0" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="flex-shrink-0" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PawPrint size={16} className="flex-shrink-0" />
                      <span className="capitalize">{appointment.pet.species}</span>
                    </div>
                  </div>

                  {appointment.reason && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={cancellingId === appointment.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
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
