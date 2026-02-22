import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function NGOProfile() {
  const [profile, setProfile] = useState({ organizationName: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/ngo/profile').then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('/ngo/profile', profile);
      setMessage('Profile updated.');
    } catch (err) {
      setMessage(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-800">Organization Profile</h1>
      <p className="text-slate-600 mt-1">Manage your NGO profile visible to volunteers.</p>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4 card p-6">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message === 'Profile updated.' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
          <input
            type="text"
            value={profile.organizationName}
            onChange={(e) => setProfile((p) => ({ ...p, organizationName: e.target.value }))}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={profile.description}
            onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
            className="input-field min-h-[100px]"
            rows={4}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
