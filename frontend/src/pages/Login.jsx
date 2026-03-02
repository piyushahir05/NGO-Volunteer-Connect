import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'NGO' ? '/ngo' : '/volunteer');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* Left decorative panel */}
      <div className="hidden md:flex flex-col justify-between bg-primary-50 border-r border-slate-200 p-12">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">
            VolunteerMatch <span className="text-primary-600">AI</span>
          </span>
        </Link>

        <div className="py-10">
          <h2 className="text-4xl font-display font-bold text-slate-800 leading-tight tracking-tight mb-4">
            Good to have <br />you <span className="text-primary-600">back.</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-xs">
            Thousands of volunteers and NGOs are already creating change. Sign in to continue your journey.
          </p>
        </div>

        <div className="flex gap-8">
          {[
            { v: '10,000+', l: 'Volunteers' },
            { v: '500+',    l: 'Partner NGOs' },
            { v: '85%',     l: 'Match Rate' },
          ].map((s) => (
            <div key={s.l}>
              <span className="block text-3xl font-bold text-primary-600 leading-none">{s.v}</span>
              <span className="block text-xs text-slate-400 tracking-widest uppercase mt-1">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1.5">Sign in</h1>
            <p className="text-sm text-slate-500">Welcome back — enter your details below.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-5">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                  <Mail size={15} />
                </span>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                  <Lock size={15} />
                </span>
                <input
                  id="password"
                  type="password"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? 'Signing in…' : (<>Sign in <ArrowRight size={15} /></>)}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-300 tracking-widest">OR</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
