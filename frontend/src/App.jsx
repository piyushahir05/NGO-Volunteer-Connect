import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";

import VolunteerDashboard from "./pages/VolunteerDashboard";
import NGODashboard from "./pages/NGODashboard";

import Opportunities from "./pages/Opportunities";
import VolunteerProfile from "./pages/VolunteerProfile";
import MyApplications from "./pages/MyApplications";

import NGOProfile from "./pages/NGOProfile";
import NGOEvents from "./pages/NGOEvents";
import EventApplicants from "./pages/EventApplicants";

// MESSAGE PAGES
import NGOMessages from "./pages/NGOMessages";
import NGOChat from "./pages/NGOChat";
import VolunteerMessages from "./pages/VolunteerMessages";
import VolunteerChat from "./pages/VolunteerChat";

/* ============================= */
/* PROTECTED ROUTE COMPONENT */
/* ============================= */

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate to={user.role === "NGO" ? "/ngo" : "/volunteer"} replace />
    );
  }

  return children;
}

/* ============================= */
/* PUBLIC ROUTE COMPONENT */
/* ============================= */

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return (
      <Navigate to={user.role === "NGO" ? "/ngo" : "/volunteer"} replace />
    );
  }

  return children;
}

/* ============================= */
/* SCROLL TO TOP */
/* ============================= */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ============================= */
/* MAIN APP */
/* ============================= */

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />


        {/* VOLUNTEER ROUTES */}

        <Route
          path="/volunteer"
          element={
            <ProtectedRoute allowedRoles={["Volunteer"]}>
              <Layout>
                <VolunteerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer/profile"
          element={
            <ProtectedRoute allowedRoles={["Volunteer"]}>
              <Layout>
                <VolunteerProfile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer/opportunities"
          element={
            <ProtectedRoute allowedRoles={["Volunteer"]}>
              <Layout>
                <Opportunities />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer/applications"
          element={
            <ProtectedRoute allowedRoles={["Volunteer"]}>
              <Layout>
                <MyApplications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* VOLUNTEER MESSAGE ROUTES */}

        <Route
          path="/volunteer/messages"
          element={
            <ProtectedRoute allowedRoles={["Volunteer"]}>
              <Layout>
                <VolunteerMessages />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer/messages/:ngoId"
          element={
            <ProtectedRoute allowedRoles={["Volunteer"]}>
              <Layout>
                <VolunteerChat />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* NGO ROUTES */}

        <Route
          path="/ngo"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <NGODashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/profile"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <NGOProfile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/events"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <NGOEvents />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/events/:eventId/applicants"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <EventApplicants />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* NGO MESSAGE ROUTES */}

        <Route
          path="/ngo/messages"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <NGOMessages />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/messages/:volunteerId"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <Layout>
                <NGOChat />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}