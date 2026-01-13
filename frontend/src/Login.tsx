import { useState } from 'react';
import api from './api';

interface LoginProps {
  onLogin: (token: string, role: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const res = await api.post('/token', formData);
      onLogin(res.data.access_token, res.data.role);
    } catch (err) {
      setError('Invalid Credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">MAMS Login</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Username</label>
            <input className="w-full p-2 border rounded" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input type="password" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="w-full bg-slate-900 text-white py-2 rounded font-bold hover:bg-slate-700">
            Sign In
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500">
          <p>Try: <b>cmdr_alpha</b> / <b>pass123</b></p>
          <p>Try: <b>log_alpha</b> / <b>pass123</b></p>
        </div>
      </div>
    </div>
  );
}