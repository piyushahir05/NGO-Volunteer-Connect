import React from 'react';
import { Link } from 'react-router-dom';

export default function VolunteerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-800">Dashboard</h1>
      <p className="text-slate-600 mt-1">Welcome back. Find opportunities that match your skills.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/volunteer/profile"
          className="card p-6 hover:shadow-md transition border-primary-100 hover:border-primary-200"
        >
          <h3 className="font-semibold text-slate-800">My Profile</h3>
          <p className="text-sm text-slate-500 mt-1">Update skills, interests, and availability.</p>
        </Link>
        <Link
          to="/volunteer/opportunities"
          className="card p-6 hover:shadow-md transition border-primary-100 hover:border-primary-200"
        >
          <h3 className="font-semibold text-slate-800">Browse Opportunities</h3>
          <p className="text-sm text-slate-500 mt-1">Discover events from NGOs and apply.</p>
        </Link>
        <Link
          to="/volunteer/applications"
          className="card p-6 hover:shadow-md transition border-primary-100 hover:border-primary-200"
        >
          <h3 className="font-semibold text-slate-800">My Applications</h3>
          <p className="text-sm text-slate-500 mt-1">Track status of your applications.</p>
        </Link>
      </div>
    </div>
  );
}
