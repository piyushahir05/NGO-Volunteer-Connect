import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function VolunteerProfile() {
  const [profile, setProfile] = useState({ skills: [], interests: '', availability: '', location: '' });
  const [skillsInput, setSkillsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
    try {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      await api.put('/volunteer/profile', {
        skills,
        interests: profile.interests,
        availability: profile.availability,
        location: profile.location,
      });
      setProfile((p) => ({ ...p, skills }));
      setMessage('Profile updated.');
    } catch (err) {
      setMessage(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-800">My Profile</h1>
      <p className="text-slate-600 mt-1">Manage your volunteer profile for better matching.</p>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4 card p-6">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message === 'Profile updated.' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            className="input-field"
            placeholder="e.g. Teaching, First Aid, Cooking"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Interests</label>
          <input
            type="text"
            value={profile.interests}
            onChange={(e) => setProfile((p) => ({ ...p, interests: e.target.value }))}
            className="input-field"
            placeholder="e.g. Education, Environment"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
          <input
            type="text"
            value={profile.availability}
            onChange={(e) => setProfile((p) => ({ ...p, availability: e.target.value }))}
            className="input-field"
            placeholder="e.g. Weekends, Evenings"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
            className="input-field"
            placeholder="City or area"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
