import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !allowedRoles.includes(user.role)) {
      navigate('/');
    } else {
      setLoading(false);
    }
  }, [user, allowedRoles, navigate]);

  if (loading) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
