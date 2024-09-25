import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/api/Context';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useAuth(); 

  useEffect(() => {
    setRole(null);
    navigate('/');
  }, [navigate, setRole]);

  return (
    <div>
      Atsijungiama...
    </div>
  );
};

export default Logout;
