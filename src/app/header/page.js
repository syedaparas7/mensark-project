"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { FiHeart } from 'react-icons/fi';
import { Menu, X, ShoppingCart, Truck } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import CartContext from '../cartcontext/cartcontext';
import Loader from '../loader/page';

import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: '700' });

export default function HeaderPage() {

  const { cartItems, setCartItems, setWishList, wishlist, currUser, setCurrUser } = useContext(CartContext);

  // Admin dynamic data

  // Modals state

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrUser(user);

    const allCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(allCartItems);

    const allWishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishList(allWishlistItems);
  }, []);


useEffect(() => {
  if (!isAdmin) return;

  const fetchData = async () => {
    try {
      const token = await currUser?.getIdToken();

      const [catRes, vidRes, revRes] = await Promise.all([
        fetch("/api/categories", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch("/api/videos", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch("/api/reviews", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      console.log("Categories status:", catRes.status);
      console.log("Videos status:", vidRes.status);
      console.log("Reviews status:", revRes.status);

      if (!catRes.ok) throw new Error(`Categories API failed ❌ ${catRes.status}`);
      if (!vidRes.ok) throw new Error(`Videos API failed ❌ ${vidRes.status}`);
      if (!revRes.ok) throw new Error(`Reviews API failed ❌ ${revRes.status}`);

      const [catData, vidData, revData] = await Promise.all([
        catRes.json(),
        vidRes.json(),
        revRes.json(),
      ]);

      setCategoriesData(catData);
      setVideosData(vidData);
      setReviewsData(revData);
    } catch (err) {
      console.error("Failed to fetch admin data:", err.message);
    }
  };

  fetchData();
}, [currUser]);  // ✅ ab safe

  const userCategories = [
    { name: "Home", link: '/' },
    { name: "All Men's", link: '/all-products' },
    { name: 'T-Shirts & Shirts', link: '/shirts' },
    { name: 'Trousers', link: '/trouser' },
    { name: 'New Arrivals', link: '/new-arrival' },
    { name: 'Sale', link: '/sale' },
  ];

  const adminCategories = [
    { name: 'Products', link: '/admindashboard/products' },
    { name: 'Orders', link: '/admindashboard/orders' },
    { name: 'Users', link: '/admindashboard/users' },
    { name: 'Categories', link: '/admindashboard/categories' },
    { name: 'Videos', link: '/admindashboard/videos' },
    { name: 'reviews', link: '/admindashboard/reviews' },
  ];

  const resetForm = () => {
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setFormError('');
  };

  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
    resetForm();
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    const { fullName, email, password, confirmPassword } = formData;

    if (!email.trim()) {
      setFormError('Email is required.');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setFormError('Password is required.');
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        setFormError('Full Name is required.');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, isSignUp, role: 'user' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || 'Something went wrong.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrUser(data.user);

      if (data.user.role === 'user') {
        router.push('/');
      }

      toast.success(isSignUp ? 'Sign-up successful!' : 'Login successful!');
      toggleLoginModal();
    } catch (err) {
      console.error('Auth error:', err.message);
      setFormError(err.message);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setCurrUser(null);
      router.push('/');
      toast.success('Logged out successfully!');
    } catch (error) {
      setFormError(error?.message);
    }
    setIsLoading(false);
  };

  const isAdmin = currUser?.role === 'admin';

  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed w-screen max-w-[100vw] top-0 left-0 z-[100]">
        <div className="bg-[#1b1b1b] text-white text-center py-2 text-sm">
          Free Shipping & Easy to Return
        </div>

        <header className="bg-white border-b border-gray-200">
          <nav className="relative w-screen max-w-[100vw] px-4 md:px-8 py-3 flex items-center justify-between">
            {/* Left section: hamburger on mobile, logo on desktop */}
            <div className="flex items-center flex-1">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="text-gray-700 focus:outline-none lg:hidden"
                aria-label="Toggle navigation"
              >
                {isNavOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo - center on mobile, left on desktop */}
              <Link
                href="/"
                className={`ml-2 lg:ml-0 mx-auto lg:mx-0 flex items-center text-2xl md:text-3xl tracking-wide text-gray-800 ${poppins.className}`}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={180}
                  height={40}
                  className="mr-2"
                />
              </Link>
            </div>

            {/* Center section - categories (only shown on lg and up) */}
            <div className="hidden lg:flex flex-1 justify-center">
              <ul className="flex space-x-4 text-sm lg:text-base text-gray-700 font-medium whitespace-nowrap">
                {(isAdmin ? adminCategories : userCategories).slice(0, 8).map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.link}
                      className={clsx(
                        'transition hover:text-black',
                        activeCategory === cat.name && 'text-black underline underline-offset-4'
                      )}
                      onClick={() => setActiveCategory(cat.name)}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}

                {(isAdmin ? adminCategories : userCategories).length > 8 && (
                  <li className="relative">
                    <button
                      className="transition hover:text-black"
                      onClick={() => setShowMore(!showMore)}
                    >
                      More
                    </button>
                    {showMore && (
                      <ul className="absolute top-full left-0 mt-2 bg-white shadow-md border rounded w-40 z-50 text-sm">
                        {(isAdmin ? adminCategories : userCategories).slice(4).map((cat) => (
                          <li key={cat.name}>
                            <Link
                              href={cat.link}
                              className={clsx(
                                'block px-4 py-2 hover:bg-gray-100',
                                activeCategory === cat.name && 'font-semibold text-black'
                              )}
                              onClick={() => {
                                setActiveCategory(cat.name);
                                setShowMore(false);
                              }}
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )}
              </ul>
            </div>
            {/* categories,vdos,reviews */}
            {isAdmin && (
              <>
                {/* <li className="relative">
                  <button
                    className="transition hover:text-black"
                    onClick={() => setOpenCategoryModal(true)}
                  >
                    Categories
                  </button>
                </li>
                <li className="relative">
                  <button
                    className="transition hover:text-black"
                    onClick={() => setOpenVideoModal(true)}
                  >
                    Videos
                  </button>
                </li>
                <li className="relative">
                  <button
                    className="transition hover:text-black"
                    onClick={() => setOpenReviewModal(true)}
                  >
                    Reviews
                  </button>
                </li> */}
              </>
            )}


            {/* Right actions */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              {!isAdmin && (

                <>
                  <button onClick={() => router.push('/wishlist')} className="relative text-gray-700 hover:text-black cursor-pointer">
                    <FiHeart className="h-6 w-6" />
                    {wishlist?.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  <button onClick={() => router.push('/cart')} className="relative text-gray-700 hover:text-black cursor-pointer">
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems?.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                  <button onClick={() => router.push('/track')} className="text-gray-700 hover:text-black cursor-pointer">
                    <Truck className="h-6 w-6" />
                  </button>

                </>
              )}

              {currUser ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1 rounded border border-red-800 hover:bg-red-700 transition-transform duration-150 cursor-pointer hover:scale-110"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="text-gray-700 hover:text-black transition-transform duration-150 cursor-pointer hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zM12 14.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile Nav */}
            {isNavOpen && (
              <ul className="fixed top-[98px] left-0 w-screen max-w-[100vw] bg-white shadow-md flex flex-col border border-gray-200 space-y-2 p-4 lg:hidden text-gray-700 font-medium z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {(isAdmin ? adminCategories : userCategories).map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.link}
                      className={clsx('block w-full', activeCategory === cat.name && 'text-black font-semibold')}
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setIsNavOpen(false);
                      }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>

        </header>
      </div>

      {loginModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg m-4 p-6 bg-white rounded-lg shadow-lg text-black">
            <button
              onClick={toggleLoginModal}
              className="absolute right-4 top-4 rounded-sm bg-gray-200 px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-300 focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
              {isSignUp ? 'Sign Up' : 'Login'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-sm placeholder-gray-400 border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                    required={isSignUp}
                  />
                </div>
              )}

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

              {isSignUp && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-sm placeholder-gray-400 border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                    required={isSignUp}
                  />
                </div>
              )}

              {formError && <p className="text-red-600 text-sm font-semibold">{formError}</p>}

              <button
                type="submit"
                className="w-full rounded bg-red-600 px-6 py-2 font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700"
              >
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>

              {!isSignUp && (
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
              )}

            </form>

            <p className="mt-4 text-center text-sm text-gray-700">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    className="font-semibold text-red-700 hover:text-red-800"
                    onClick={toggleAuthMode}
                    type="button"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    className="font-semibold text-red-700 hover:text-red-800"
                    onClick={toggleAuthMode}
                    type="button"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}


      {showForgotPassword && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-lg text-black">
            <button
              onClick={() => setShowForgotPassword(true)}
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
