import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import {
  Building2, FileText, CheckCircle, AlertCircle,
  Save, Eye, Edit2, X, Loader2, Sparkles, MapPin, Mail
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const glassCardClass = "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(5,150,105,0.04)] rounded-[1.5rem] overflow-hidden";
const glassInputClass = "w-full bg-white/50 border border-white/80 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/90 transition-all backdrop-blur-sm shadow-inner placeholder:text-slate-400";
const glassLabelClass = "block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 ml-1";

export default function NGOProfile() {
  const [profile, setProfile] = useState({ organizationName: '', description: '' });
  const [formData, setFormData] = useState({ organizationName: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api.get('/ngo/profile')
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);
    try {
      await api.put('/ngo/profile', formData);
      setProfile(formData);
      setMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setMessage(err.message || 'Update failed. Please try again.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  const filled = [profile.organizationName, profile.description].filter(Boolean).length;
  const pct = Math.round((filled / 2) * 100);

  return (
    <div className="relative min-h-screen bg-[#F9F6F0] overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Ambient Background Blobs */}
      <div className="fixed top-[0%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-300/20 blur-[100px] pointer-events-none mix-blend-multiply animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 h-[50vh]">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="mt-4 text-xs font-bold tracking-widest text-emerald-600 uppercase">Loading Profile...</span>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">

            {/* ── Header Card ── */}
            <motion.div variants={fadeUp} className={`${glassCardClass} p-6 md:p-8 relative overflow-visible`}>
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Sparkles size={100} className="text-emerald-600" />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-1 shadow-md flex-shrink-0">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <Building2 size={36} className="text-emerald-600" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle size={14} className="text-white" strokeWidth={3} />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/80 shadow-sm text-emerald-700 text-[10px] font-bold tracking-widest uppercase mb-2 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified NGO
                  </div>
                  <h1 className="font-display text-3xl font-extrabold text-slate-800 tracking-tight leading-none mb-1.5">
                    {profile.organizationName || <span className="text-slate-300 italic font-normal text-xl">No name set</span>}
                  </h1>
                  <p className="text-sm font-bold text-slate-500">Organization Profile</p>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => { setIsEditing(true); setFormData(profile); setMessage(''); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/60 border border-white/80 shadow-sm rounded-xl text-sm font-bold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md mt-4 sm:mt-0"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            </motion.div>

            {/* ── Content: View / Edit ── */}
            <AnimatePresence mode="wait">
              {!isEditing ? (

                // ── VIEW MODE ──
                <motion.div
                  key="view"
                  initial="hidden" animate="visible" exit="exit"
                  variants={fadeUp}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start"
                >
                  {/* Main Info */}
                  <div className="space-y-6">

                    {/* Organization Name */}
                    <div className={`${glassCardClass} p-6 md:p-8`}>
                      <div className="flex items-center gap-2 mb-4 text-emerald-700">
                        <Building2 size={18} strokeWidth={2.5} />
                        <h2 className="font-display text-lg font-bold text-slate-800">Organization Name</h2>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {profile.organizationName || <span className="text-slate-400 italic">No organization name provided.</span>}
                      </p>
                    </div>

                    {/* Description */}
                    <div className={`${glassCardClass} p-6 md:p-8`}>
                      <div className="flex items-center gap-2 mb-4 text-blue-600">
                        <FileText size={18} strokeWidth={2.5} />
                        <h2 className="font-display text-lg font-bold text-slate-800">Description</h2>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {profile.description || <span className="text-slate-400 italic">No description provided yet. Click 'Edit Profile' to describe your mission.</span>}
                      </p>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="flex flex-col gap-4">

                    {/* Volunteer Preview */}
                    <div className={`${glassCardClass} p-5`}>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800 mb-3">
                        <Eye size={13} className="text-emerald-600" /> Volunteer Preview
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50/70 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-2.5">
                        <Building2 size={10} /> NGO
                      </span>
                      <div className="text-base font-bold text-slate-800 mb-1.5 min-h-[22px]">
                        {profile.organizationName || <span className="text-slate-300 italic font-normal">Organization name…</span>}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-4 min-h-[40px]">
                        {profile.description || <span className="text-slate-300 italic">Your description will appear here…</span>}
                      </p>
                    </div>

                    {/* Profile Completeness */}
                    <div className={`${glassCardClass} p-5`}>
                      <div className="text-sm font-bold text-slate-800 mb-2">Profile Completeness</div>
                      <div className="h-2 bg-white/40 border border-white/60 rounded-full overflow-hidden my-2.5">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{pct}% complete — {filled} of 2 fields filled</span>
                    </div>

                    {/* Tips */}
                    <div className={`${glassCardClass} p-5`}>
                      <div className="text-sm font-bold text-slate-800 mb-3">Tips for attracting volunteers</div>
                      <div className="flex flex-col gap-2.5">
                        {[
                          'Use your full registered organization name so volunteers can verify you.',
                          'Describe your mission clearly in 2–3 sentences.',
                          'Mention the causes you work on — e.g. education, environment, health.',
                          'Keep your description updated as your focus areas evolve.',
                        ].map((t) => (
                          <div className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed" key={t}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>

              ) : (

                // ── EDIT MODE ──
                <motion.form
                  key="edit"
                  initial="hidden" animate="visible" exit="exit"
                  variants={fadeUp}
                  onSubmit={handleSubmit}
                  className={`${glassCardClass} p-6 sm:p-8`}
                >
                  <div className="flex items-center justify-between mb-8 border-b border-white/60 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-600">
                        <Edit2 size={20} />
                      </div>
                      <h2 className="font-display text-xl font-bold text-slate-800">Editing Organization Profile</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="p-2 bg-white/40 hover:bg-white/80 border border-white/60 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {message && (
                    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl mb-6 text-sm leading-relaxed backdrop-blur-sm ${
                      isError
                        ? 'bg-red-50/80 border border-red-200 text-red-700'
                        : 'bg-emerald-50/80 border border-emerald-200 text-emerald-700'
                    }`}>
                      {isError
                        ? <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        : <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                      }
                      {message}
                    </div>
                  )}

                  <div className="flex flex-col gap-6">
                    {/* Organization Name */}
                    <div>
                      <label className={glassLabelClass}>Organization Name</label>
                      <div className="relative">
                        <Building2 size={18} className="absolute left-4 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleChange}
                          placeholder="e.g. Green Earth Foundation"
                          className={`${glassInputClass} pl-12`}
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 ml-1">This is the name volunteers will see when browsing.</p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className={glassLabelClass}>Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        maxLength={600}
                        placeholder="Describe your organization's mission, focus areas, and the kind of volunteers you're looking for…"
                        className={`${glassInputClass} resize-vertical min-h-[120px] leading-relaxed`}
                      />
                      <div className={`text-xs text-right mt-1 ${
                        formData.description.length > 540 ? 'text-amber-500' : 'text-slate-400'
                      } ${formData.description.length >= 600 ? 'text-red-500' : ''}`}>
                        {formData.description.length} / 600
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 ml-1">A clear description helps volunteers understand your mission.</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-white/60">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                      className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white/40 hover:bg-white/80 border border-white/60 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </div>
    </div>
  );
}