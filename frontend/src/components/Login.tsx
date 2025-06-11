import React, { useState } from 'react';

interface LoginProps {
  onLogin: (token: string) => void;
  setShowSignup: (show: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, setShowSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLogin(data.token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          className="w-full mb-4 p-2 border border-blue-200 rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 border border-blue-200 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" type="submit">Login</button>
        <div className="mt-4 text-center w-full">
          <button type="button" className="text-blue-600 underline" onClick={() => setShowSignup(true)}>
            Don't have an account? Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
