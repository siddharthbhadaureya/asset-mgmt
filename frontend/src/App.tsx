import { useState } from 'react';
import Dashboard from './Dashboard';
import Transfer from './Transfer';
import Login from './Login';
import api from './api';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Successful login
  const handleLogin = (newToken: string, newRole: string) => {
    setToken(newToken);
    setRole(newRole);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    delete api.defaults.headers.common['Authorization'];
  };

  // If not logged in, show Login Page
  if (!token) {
    return <Login onLogin={handleLogin} />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-bold text-xl tracking-tight">MAMS | {role}</span>
          <div className="space-x-2">
            <button onClick={() => setCurrentPage('dashboard')} className={`px-3 py-1 rounded ${currentPage === 'dashboard' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>Dashboard</button>
            <button onClick={() => setCurrentPage('transfer')} className={`px-3 py-1 rounded ${currentPage === 'transfer' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>Transfers</button>
            <button onClick={handleLogout} className="px-3 py-1 text-red-300 hover:text-white border border-red-900 rounded">Logout</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-6">
        {currentPage === 'dashboard' ? <Dashboard /> : <Transfer />}
      </main>
    </div>
  );
}

export default App;