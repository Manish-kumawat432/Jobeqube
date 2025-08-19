import { Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Loguot from './components/Loguot';
import Jobs from './components/Jobs';
import Browser from './components/Browser';
import Profile from './components/Profile';
import JobDescription from './components/JobDescription';
import Companies from './components/Admin/Companies';
import CompanyCreate from './components/Admin/CompanyCreate';
import CompanySetUp from './components/Admin/CompanySetUp';
import AdminJobs from './components/Admin/AdminJobs';
import PostJob from './components/Admin/PostJob';
import Applicants from './components/Admin/Applicants';
import EditJob from './components/Admin/EditJob';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chat from './components/Chat';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Loguot />} />

        <Route
          path="/description/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <JobDescription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browser"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Browser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <Companies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/create"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CompanyCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/:id"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CompanySetUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <AdminJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/create"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id/applicants"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <EditJob />
            </ProtectedRoute>
          }
        />

              <Route
  path="/chat"
  element={
    <ProtectedRoute allowedRoles={['student', 'recruiter']}>
      <Chat />
    </ProtectedRoute>
  }
/>
      </Routes>



    </>
  );
}

export default App;
