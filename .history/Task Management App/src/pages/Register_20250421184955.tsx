import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email.trim()) {
      localStorage.setItem('email', email);
      navigate('/tasks');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
      <h1 style={{ color: 'white' }}>🔐 Login</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          padding: '0.5rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '1rem',
          width: '250px',
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Login
      </button>
    </div>
  );
}


