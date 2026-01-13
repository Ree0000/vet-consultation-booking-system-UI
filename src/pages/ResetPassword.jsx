import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { showToast } from '../components/Layout/Toast';
import SimpleFooter from '../components/Layout/SimpleFooter';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast('Harap isi semua kolom', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Kata sandi minimal 6 karakter', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Kata sandi tidak cocok', 'error');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setResetSuccess(true);
      showToast('Pengaturan ulang kata sandi berhasil!', 'success');

      // Redirect ke halaman login setelah 3 detik
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      showToast(
        error.response?.data?.message || 'Gagal mengatur ulang kata sandi. Tautan mungkin kedaluwarsa.',
        'error'
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mb-4 shadow-lg">
              <Heart size={40} className="text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Atur Ulang Kata Sandi</h1>
            <p className="text-gray-500">
              {resetSuccess ? 'Kata sandi berhasil diatur ulang!' : 'Masukkan kata sandi baru Anda'}
            </p>
          </div>

          {/* Kartu Formulir */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
            {resetSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pengaturan Ulang Kata Sandi Selesai!</h3>
                <p className="text-gray-600 mb-6">
                  Kata sandi Anda telah berhasil diatur ulang. Anda sekarang dapat login dengan kata sandi baru.
                </p>
                <p className="text-sm text-gray-500">Mengalihkan ke halaman login...</p>
              </div>
            ) : (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="Masukkan kata sandi baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="Konfirmasi kata sandi baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Mengatur Ulang Kata Sandi...' : 'Atur Ulang Kata Sandi'}
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

export default ResetPassword;
