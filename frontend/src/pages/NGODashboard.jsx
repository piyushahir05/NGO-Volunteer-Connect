import React from 'react';
import { Link } from 'react-router-dom';

export default function NGODashboard() {
  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-800">Dashboard</h1>
      <p className="text-slate-600 mt-1">Manage your organization and volunteering events.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/ngo/profile"
          className="card p-6 hover:shadow-md transition border-primary-100 hover:border-primary-200"
        >
          <h3 className="font-semibold text-slate-800">Organization Profile</h3>
          <p className="text-sm text-slate-500 mt-1">Update your NGO name and description.</p>
        </Link>
        <Link
          to="/ngo/events"
          className="card p-6 hover:shadow-md transition border-primary-100 hover:border-primary-200"
        >
          <h3 className="font-semibold text-slate-800">My Events</h3>
          <p className="text-sm text-slate-500 mt-1">Post and manage volunteering opportunities.</p>
        </Link>
      </div>
    </div>
  );
}
