import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
  Building2, FileText,
  CheckCircle, AlertCircle, Save, Eye
} from 'lucide-react';

export default function NGOProfile() {
  const [profile, setProfile] = useState({ organizationName: '', description: '' });
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api.get('/ngo/profile').then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);
    try {
      await api.put('/ngo/profile', profile);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.message || 'Update failed. Please try again.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  const filled = [profile.organizationName, profile.description].filter(Boolean).length;
  const pct    = Math.round((filled / 2) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">Organization Profile</h1>
        <p className="text-slate-500">This information is visible to volunteers browsing opportunities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <form onSubmit={handleSubmit}>

            {message && (
              <div className={`flex items-start gap-2.5 p-3.5 rounded-xl mb-5 text-sm leading-relaxed ${
                isError ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-primary-50 border border-primary-200 text-primary-700'
              }`}>
                {isError
                  ? <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  : <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                }
                {message}
              </div>
            )}

            {/* Organization Name */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Building2 size={13} className="text-primary-600" />
                </span>
                Organization Name
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                placeholder="e.g. Green Earth Foundation"
                value={profile.organizationName}
                onChange={(e) => setProfile((p) => ({ ...p, organizationName: e.target.value }))}
                required
              />
              <p className="text-xs text-slate-400 mt-1.5">This is the name volunteers will see when browsing.</p>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={13} className="text-primary-600" />
                </span>
                Description
              </label>
              <textarea
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition resize-vertical min-h-[120px] leading-relaxed"
                placeholder="Describe your organization's mission, focus areas, and the kind of volunteers you're looking for…"
                rows={5}
                maxLength={600}
                value={profile.description}
                onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
              />
              <div className={`text-xs text-right mt-1 ${profile.description.length > 540 ? 'text-amber-500' : 'text-slate-400'} ${profile.description.length >= 600 ? 'text-red-500' : ''}`}>
                {profile.description.length} / 600
              </div>
              <p className="text-xs text-slate-400 mt-0.5">A clear description helps volunteers understand your mission.</p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              disabled={saving}
            >
              <Save size={15} />
              {saving ? 'Saving…' : 'Save Profile'}
            </button>

          </form>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">

          {/* Live preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800 mb-3">
              <Eye size={13} className="text-primary-600" /> Volunteer Preview
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-2.5">
              <Building2 size={10} /> NGO
            </span>
            <div className="text-base font-bold text-slate-800 mb-1.5 min-h-[22px]">
              {profile.organizationName || <span className="text-slate-300 italic font-normal">Organization name…</span>}
            </div>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-4 min-h-[40px]">
              {profile.description || <span className="text-slate-300 italic">Your description will appear here…</span>}
            </p>
          </div>

          {/* Completeness */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="text-sm font-bold text-slate-800 mb-2">Profile Completeness</div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden my-2.5">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{pct}% complete — {filled} of 2 fields filled</span>
          </div>

          {/* Tips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="text-sm font-bold text-slate-800 mb-3">Tips for attracting volunteers</div>
            <div className="flex flex-col gap-2.5">
              {[
                'Use your full registered organization name so volunteers can verify you.',
                'Describe your mission clearly in 2–3 sentences.',
                'Mention the causes you work on — e.g. education, environment, health.',
                'Keep your description updated as your focus areas evolve.',
              ].map((t) => (
                <div className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed" key={t}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0 mt-1.5" />
                  {t}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
