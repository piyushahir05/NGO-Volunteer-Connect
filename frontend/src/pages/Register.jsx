import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff,
  Users, Building2, ShieldCheck, TrendingUp, Rocket
} from 'lucide-react';

// --- Animation Variants (same as Home & Login) ---
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const TRUST_ITEMS = [
  { Icon: ShieldCheck, label: 'Secure & Private' },
  { Icon: Users,       label: 'Verified NGOs' },
  { Icon: TrendingUp,  label: 'Real Impact' },
];

const ROLE_CARDS = [
  {
    r: 'Volunteer',
    Icon: Users,
    desc: 'Find causes that match your skills and schedule.',
    activeColor: 'border-primary-500 bg-primary-50 text-primary-700',
    iconActive: 'bg-primary-100 text-primary-600',
    iconIdle: 'bg-slate-100 text-slate-500',
  },
  {
    r: 'NGO',
    Icon: Building2,
    desc: 'Post opportunities and get matched with ideal volunteers.',
    activeColor: 'border-primary-500 bg-primary-50 text-primary-700',
    iconActive: 'bg-primary-100 text-primary-600',
    iconIdle: 'bg-slate-100 text-slate-500',
  },
];

// --- 3D Globe (identical to Home & Login) ---
function ThreeDCorner() {
  const mountRef = useRef(null);

  useEffect(() => {
    const w = 400;
    const h = 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x16a34a,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      sphere.rotation.x += 0.002;
      sphere.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      ref={mountRef}
      className="absolute bottom-0 right-0 translate-y-16 translate-x-16 pointer-events-none z-0 hidden lg:block"
      style={{ width: '400px', height: '400px' }}
    />
  );
}

// --- Floating ambient blobs ---
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-emerald-200/30 rounded-full blur-[80px]" />
    </div>
  );
}

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [role, setRole]         = useState('Volunteer');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState(null);

  const { register } = useAuth();
  const navigate     = useNavigate();

  // Scroll progress bar (same as Home & Login)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      navigate(user.role === 'NGO' ? '/ngo' : '/volunteer');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] font-sans text-slate-800 antialiased overflow-x-hidden selection:bg-primary-200 selection:text-primary-900 relative">

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* HEADER */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-[#F9F6F0]/80 backdrop-blur-md border-b border-[#E8E3D9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <img
              src="/logo.png"
              alt="VolunteerConnect Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-display text-lg sm:text-xl text-slate-900 font-bold tracking-tight">
              VolunteerConnect
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
              Log in
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <main className="relative pt-4 pb-20 lg:pt-6 lg:pb-24 overflow-hidden">
        <FloatingOrbs />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 min-h-[calc(100vh-160px)]">

            {/* ── LEFT: Branding panel ── */}
            <motion.div
              className="w-full lg:w-1/2 flex flex-col justify-between"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <div>
                {/* Badge */}
                <motion.div variants={fadeUp} className="mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#E8E3D9] shadow-sm text-primary-700 text-xs sm:text-sm font-bold tracking-wide backdrop-blur-sm">
                    <Sparkles size={14} className="text-primary-500" />
                    Join the Community
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={fadeUp}
                  className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-slate-900 mb-6"
                >
                  Start making an{' '}
                  <span className="text-primary-600 italic">impact today.</span>
                </motion.h1>

                {/* Sub */}
                <motion.p
                  variants={fadeUp}
                  className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg mb-12 font-medium"
                >
                  Join a growing community of volunteers and NGOs connecting the right people with the right causes.
                </motion.p>

                {/* Role preview cards */}
                <motion.div variants={staggerContainer} className="flex flex-col gap-3 mb-12 max-w-md">
                  {ROLE_CARDS.map(({ r, Icon, desc }) => (
                    <motion.div
                      key={r}
                      variants={fadeUp}
                      className="flex items-start gap-3 p-4 bg-white/70 border border-[#E8E3D9] rounded-2xl backdrop-blur-sm shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={17} className="text-primary-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 mb-0.5">{r === 'NGO' ? 'NGOs & Organizations' : 'Volunteers'}</div>
                        <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Trust pills */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  {TRUST_ITEMS.map(({ Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 border border-[#E8E3D9] text-sm font-semibold text-slate-600 backdrop-blur-sm shadow-sm"
                    >
                      <Icon size={14} className="text-primary-500" />
                      {label}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* 3D globe decorative */}
              <div className="relative hidden lg:block mt-16 h-0">
                <ThreeDCorner />
              </div>
            </motion.div>

            {/* ── RIGHT: Register Card ── */}
            <motion.div
              className="w-full lg:w-1/2 flex items-center justify-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="w-full max-w-md relative">
                {/* Card glow */}
                <div className="absolute -inset-4 bg-primary-100/40 rounded-[3rem] blur-2xl z-0 pointer-events-none" />

                <div className="relative z-10 bg-white rounded-[2.5rem] border border-[#E8E3D9] shadow-2xl shadow-slate-900/10 p-8 sm:p-10">

                  {/* Card header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-8"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 shadow-sm mb-5">
                      <Rocket size={24} className="text-primary-600" />
                    </div>
                    <h2 className="font-display text-3xl text-slate-900 font-bold tracking-tight mb-1.5">
                      Create account
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Fill in your details to get started.
                    </p>
                  </motion.div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                        className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full name */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">
                        Full name
                      </label>
                      <div className={`relative rounded-xl transition-all duration-300 ${focused === 'name' ? 'ring-2 ring-primary-500/30' : ''}`}>
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                          <User size={15} />
                        </span>
                        <input
                          id="name"
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200"
                          placeholder="Your name or organization"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                        Email address
                      </label>
                      <div className={`relative rounded-xl transition-all duration-300 ${focused === 'email' ? 'ring-2 ring-primary-500/30' : ''}`}>
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                          <Mail size={15} />
                        </span>
                        <input
                          id="email"
                          type="email"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Password */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                        Password
                      </label>
                      <div className={`relative rounded-xl transition-all duration-300 ${focused === 'password' ? 'ring-2 ring-primary-500/30' : ''}`}>
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                          <Lock size={15} />
                        </span>
                        <input
                          id="password"
                          type={showPw ? 'text' : 'password'}
                          className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200"
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocused('password')}
                          onBlur={() => setFocused(null)}
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors p-1"
                          tabIndex={-1}
                        >
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </motion.div>

                    {/* Role selector */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-2">I am a</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {ROLE_CARDS.map(({ r, Icon }) => (
                          <div key={r} className="relative">
                            <input
                              type="radio"
                              name="role"
                              id={`role-${r}`}
                              value={r}
                              checked={role === r}
                              onChange={(e) => setRole(e.target.value)}
                              className="absolute opacity-0 w-0 h-0"
                            />
                            <label
                              htmlFor={`role-${r}`}
                              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm font-semibold ${
                                role === r
                                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:bg-primary-50/30'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                role === r ? 'bg-primary-100' : 'bg-slate-100'
                              }`}>
                                <Icon size={14} className={role === r ? 'text-primary-600' : 'text-slate-500'} />
                              </div>
                              {r}
                            </label>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Submit */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 mt-1"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Creating account…
                          </>
                        ) : (
                          <>Create account <ArrowRight size={15} /></>
                        )}
                      </button>
                    </motion.div>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-[#E8E3D9]" />
                    <span className="text-xs text-slate-300 tracking-widest font-semibold">OR</span>
                    <div className="flex-1 h-px bg-[#E8E3D9]" />
                  </div>

                  {/* Sign in link */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85 }}
                    className="text-center text-sm text-slate-500"
                  >
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-bold hover:underline">
                      Sign in
                    </Link>
                  </motion.p>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E8E3D9] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 no-underline mb-6">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-display text-xl text-slate-900 font-bold">VolunteerConnect</span>
              </Link>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                Empowering communities by connecting passionate individuals with impactful non-profit organizations globally.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/about"   className="text-slate-500 hover:text-primary-600 font-medium transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Get Involved</h4>
              <ul className="space-y-4">
                <li><Link to="/register?role=volunteer" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Become a Volunteer</Link></li>
                <li><Link to="/register?role=ngo"       className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Register NGO</Link></li>
                <li><Link to="/login"                   className="text-slate-500 hover:text-primary-600 font-medium transition-colors">Sign In</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E8E3D9] pt-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 font-medium text-sm">
              © {new Date().getFullYear()} VolunteerConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}