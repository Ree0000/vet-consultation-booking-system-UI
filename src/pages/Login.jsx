import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Heart, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Layout/Toast';
import SimpleFooter from '../components/Layout/SimpleFooter';

const Login = () => {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  // Redirect jika sudah login
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginMode) {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        showToast('Login berhasil! Selamat datang kembali.', 'success');

        // Redirect berdasarkan peran
        if (result.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        showToast(result.error, 'error');
      }
    } else {
      const result = await register(formData);

      if (result.success) {
        showToast('Akun berhasil dibuat! Selamat datang di PawCare.', 'success');
        navigate('/dashboard');
      } else {
        showToast(result.error, 'error');
      }
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ email: '', password: '', name: '', phone: '' });
    setShowPassword(false);
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Klinik Urban Animal</h1>
            <p className="text-gray-500">Perawatan untuk hewan peliharaan kesayangan Anda</p>
          </div>

          {/* Kartu Formulir */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
            {/* Tombol Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => isLoginMode || toggleMode()}
                className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${isLoginMode
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => !isLoginMode || toggleMode()}
                className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${!isLoginMode
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Daftar
              </button>
            </div>

            {/* Formulir */}
            <div className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    placeholder="anda@contoh.com"
                    required
                  />
                </div>
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                      placeholder="+628123456789"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    placeholder="••••••••"
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
              </div>

              {isLoginMode && (
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Lupa Kata Sandi?
                  </Link>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Harap tunggu...' : isLoginMode ? 'Login ke Akun Anda' : 'Buat Akun'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default Login;
