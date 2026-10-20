import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { PublicPortfolio } from './pages/public/PublicPortfolio';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Code-split admin pages to optimize public bundle size
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview').then(m => ({ default: m.AdminOverview })));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile').then(m => ({ default: m.AdminProfile })));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects').then(m => ({ default: m.AdminProjects })));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills').then(m => ({ default: m.AdminSkills })));
const AdminExperiences = lazy(() => import('./pages/admin/AdminExperiences').then(m => ({ default: m.AdminExperiences })));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles').then(m => ({ default: m.AdminArticles })));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia').then(m => ({ default: m.AdminMedia })));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages').then(m => ({ default: m.AdminMessages })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center text-sky-400">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Portfolio Route */}
        <Route
          path="/"
          element={
            <PortfolioProvider>
              <PublicPortfolio />
            </PortfolioProvider>
          }
        />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin CMS Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
