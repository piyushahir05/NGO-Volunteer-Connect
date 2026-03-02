import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, User, ArrowRight, Users, Building2 } from 'lucide-react';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('Volunteer');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
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
    <div className="min-h-screen grid md:grid-cols-2">

      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between bg-primary-50 border-r border-slate-200 p-12">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">
            VolunteerMatch
          </span>
        </Link>

        <div className="py-8">
          <h2 className="text-4xl font-display font-bold text-slate-800 leading-tight tracking-tight mb-4">
            Start making <br />an <span className="text-primary-600">impact today.</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-xs mb-8">
            Join a growing community of volunteers and NGOs connecting the right people with the right causes.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Users size={17} className="text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 mb-0.5">Volunteers</div>
                <div className="text-xs text-slate-500 leading-relaxed">Find causes that match your skills and schedule.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Building2 size={17} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 mb-0.5">NGOs & Organizations</div>
                <div className="text-xs text-slate-500 leading-relaxed">Post opportunities and get matched with ideal volunteers.</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-8 md:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">

          <div className="mb-7">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1.5">Create account</h1>
            <p className="text-sm text-slate-500">Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">
                Full name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                  <User size={15} />
                </span>
                <input
                  id="name"
                  type="text"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  placeholder="Your name or organization"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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

            <div className="mb-4">
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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-2.5">
                {['Volunteer', 'NGO'].map((r) => (
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
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                        role === r
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        role === r ? 'bg-primary-100' : 'bg-slate-100'
                      }`}>
                        {r === 'Volunteer'
                          ? <Users size={14} className={role === r ? 'text-primary-600' : 'text-slate-500'} />
                          : <Building2 size={14} className={role === r ? 'text-primary-600' : 'text-slate-500'} />
                        }
                      </div>
                      {r}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
              disabled={loading}
            >
              {loading ? 'Creating account…' : (<>Create account <ArrowRight size={15} /></>)}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-300 tracking-widest">OR</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
