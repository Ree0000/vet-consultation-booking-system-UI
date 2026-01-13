import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { showToast } from '../components/Layout/Toast';
import SimpleFooter from '../components/Layout/SimpleFooter';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast('Harap masukkan alamat email Anda', 'warning');
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Harap masukkan alamat email yang valid', 'warning');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setEmailSent(true);
      showToast('Tautan reset kata sandi telah dikirim ke email Anda', 'success');
    } catch (error) {
      console.error('Forgot password error:', error);
      showToast(error.response?.data?.message || 'Gagal mengirim email reset', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Tautan Kembali ke Login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Kembali ke Login</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mb-4 shadow-lg">
              <Heart size={40} className="text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Lupa Kata Sandi?</h1>
            <p className="text-gray-500">
              {emailSent
                ? 'Periksa email Anda untuk instruksi reset'
                : 'Jangan khawatir! Kami akan mengirimkan instruksi reset'}
            </p>
          </div>

          {/* Kartu Formulir */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
            {emailSent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Periksa Email Anda</h3>
                <p className="text-gray-600 mb-6">
                  Jika akun untuk <strong>{email}</strong> ada, Anda akan menerima tautan reset kata sandi segera.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-gray-700">
                    <strong>Langkah selanjutnya:</strong>
                  </p>
                  <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
                    <li>Periksa kotak masuk email Anda</li>
                    <li>Klik tautan reset kata sandi</li>
                    <li>Buat kata sandi baru Anda</li>
                    <li>Login dengan kata sandi baru Anda</li>
                  </ol>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Tidak menerima email? Periksa folder spam, verifikasi alamat email, atau coba lagi.
                </p>
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Kirim ulang
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="anda@contoh.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Ingat kata sandi Anda?{' '}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Login di sini
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default ForgotPassword;
