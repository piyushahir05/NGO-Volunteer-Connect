import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
  User, Lightbulb, Clock, MapPin,
  CheckCircle, AlertCircle, Save, Tag
} from 'lucide-react';

export default function VolunteerProfile() {
  const [profile, setProfile]       = useState({ skills: [], interests: '', availability: '', location: '' });
  const [skillsInput, setSkillsInput] = useState('');
  const [saving, setSaving]         = useState(false);
  const [message, setMessage]       = useState('');
  const [isError, setIsError]       = useState(false);

  useEffect(() => {
    api.get('/volunteer/profile').then((res) => {
      setProfile(res.data);
      setSkillsInput((res.data.skills || []).join(', '));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);
    try {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      await api.put('/volunteer/profile', {
        skills,
        interests:    profile.interests,
        availability: profile.availability,
        location:     profile.location,
      });
      setProfile((p) => ({ ...p, skills }));
      setMessage('Profile updated successfully.');
      setIsError(false);
    } catch (err) {
      setMessage(err.message || 'Update failed. Please try again.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  const skillTags = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

  const FIELDS = [
    {
      key:         'skillsInput',
      label:       'Skills',
      icon:        Tag,
      placeholder: 'e.g. Teaching, First Aid, Cooking',
      hint:        'Separate each skill with a comma.',
      value:       skillsInput,
      onChange:    (v) => setSkillsInput(v),
    },
    {
      key:         'interests',
      label:       'Interests',
      icon:        Lightbulb,
      placeholder: 'e.g. Education, Environment, Healthcare',
      hint:        'Causes you care about most.',
      value:       profile.interests,
      onChange:    (v) => setProfile((p) => ({ ...p, interests: v })),
    },
    {
      key:         'availability',
      label:       'Availability',
      icon:        Clock,
      placeholder: 'e.g. Weekends, Evenings, Full-time',
      hint:        'When you are generally free to volunteer.',
      value:       profile.availability,
      onChange:    (v) => setProfile((p) => ({ ...p, availability: v })),
    },
    {
      key:         'location',
      label:       'Location',
      icon:        MapPin,
      placeholder: 'City or area',
      hint:        'Helps match you with nearby opportunities.',
      value:       profile.location,
      onChange:    (v) => setProfile((p) => ({ ...p, location: v })),
    },
  ];

  const fields = [skillsInput, profile.interests, profile.availability, profile.location];
  const filled = fields.filter(Boolean).length;
  const pct    = Math.round((filled / fields.length) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">My Profile</h1>
        <p className="text-slate-500">Keep your profile up to date for better opportunity matching.</p>
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

            {FIELDS.map((f) => (
              <div className="mb-5" key={f.key}>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <f.icon size={13} className="text-primary-600" />
                  </span>
                  {f.label}
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1.5">{f.hint}</p>
              </div>
            ))}

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

          {/* Skills preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="text-sm font-bold text-slate-800 mb-3">Skills Preview</div>
            <div className="flex flex-wrap gap-2">
              {skillTags.length > 0
                ? skillTags.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium">{s}</span>
                  ))
                : <span className="text-sm text-slate-400">No skills added yet.</span>
              }
            </div>
          </div>

          {/* Profile completeness */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="text-sm font-bold text-slate-800 mb-2">Profile Completeness</div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden my-2.5">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">{pct}% complete — {filled} of {fields.length} fields filled</span>
          </div>

          {/* Tips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="text-sm font-bold text-slate-800 mb-3">Tips for better matches</div>
            <div className="flex flex-col gap-2.5">
              {[
                'Add at least 3 skills to improve match accuracy.',
                'Be specific with interests — "Wildlife Conservation" beats "Environment".',
                'Update your availability regularly so NGOs know when to reach you.',
                'Adding your location unlocks nearby opportunities.',
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
