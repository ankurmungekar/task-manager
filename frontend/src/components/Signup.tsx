import React, { useState } from 'react';

interface SignupProps {
  onSignup: () => void;
  setShowSignup: (show: boolean) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, setShowSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setSuccess('Signup successful! You can now log in.');
      setUsername('');
      setPassword('');
      onSignup();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Sign Up</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
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
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition" type="submit">Sign Up</button>
        <div className="mt-4 text-center w-full">
          <button type="button" className="text-blue-600 underline" onClick={() => setShowSignup(false)}>
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
