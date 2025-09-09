'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import CartContext from '../cartcontext/cartcontext';
import Image from 'next/image';
import Loader from '../loader/page';

function LoginModal( ) {
  const [loginModalOpen, setLoginModalOpen] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { setCurrUser } = useContext(CartContext);
  const [resetEmail, setResetEmail] = useState('');

  const router = useRouter();

  const forgotPasswordHandler = async (resetEmail) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const res = await fetch('/api/resetpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || 'Something went wrong.');
      } else {
        toast.success('Password reset email sent!');
      }
    } catch (err) {
      console.error('Reset password error:', err.message);
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleChange = (e) => {
    setFormError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }
    setIsLoading(true)
    setFormError('');

    const { email, password } = formData;

    try {
      const res = await fetch('/api/adminauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || 'Something went wrong.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrUser && setCurrUser(data.user);


      toast.success('Login successful!');
      setLoginModalOpen(false)

      if (data.user.role === 'admin') {
        router.push('/admindashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormError(error.message || 'Something went wrong');
    }

    setIsLoading(false);
  };

  if (!loginModalOpen) return null;

  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="relative w-full max-w-lg m-4 p-10 bg-white rounded-lg shadow-lg text-black">
          {/* Close button */}
          <button
            type="button"
            onClick={toggleLoginModal}
            className="absolute right-4 top-4 rounded-sm bg-gray-200 px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-300 focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="h-36 w-auto object-contain py-4"
              priority
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Username or Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-sm placeholder-gray-400 border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-sm placeholder-gray-400 border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            {formError && (
              <p className="text-red-600 text-sm font-semibold">{formError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded bg-red-600 px-6 py-2 font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700"
            >
              Login
            </button>

            <div className="text-right text-sm">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setFormError('');
                }}
                className="text-red-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

          </form>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-lg text-black">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute right-4 top-4 rounded-sm bg-gray-200 px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-300 focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h3 className="text-lg font-semibold text-center mb-4">Reset Your Password</h3>

            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full rounded-sm border border-gray-300 px-3 py-2 mb-4 focus:border-red-500 focus:ring-red-500"
            />

            {formError && <p className="text-red-600 text-sm font-semibold mb-2">{formError}</p>}

            <button
              onClick={async () => {
                if (!resetEmail.trim()) {
                  setFormError('Email is required.');
                  return;
                }
                await forgotPasswordHandler(resetEmail);
                setShowForgotPassword(false);
                setResetEmail('');
              }}
              className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700"
            >
              Send Reset Email
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginModal;
