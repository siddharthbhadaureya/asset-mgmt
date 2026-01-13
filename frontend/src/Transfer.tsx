import { useState, useEffect } from 'react';
import api from './api';

export default function Transfer() {
  const [assets, setAssets] = useState<any[]>([]);
  const [bases] = useState([{ id: 1, name: 'Base Alpha' }, { id: 2, name: 'Base Bravo' }]);

  const [selectedAsset, setSelectedAsset] = useState(1);
  const [fromBase, setFromBase] = useState(1);
  const [toBase, setToBase] = useState(2);
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/assets').then(res => setAssets(res.data));
  }, []);

  const handleTransfer = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/transfer', {
        asset_type_id: selectedAsset,
        source_base_id: fromBase,
        dest_base_id: toBase,
        quantity: Number(quantity),
        user_id: 2
      });
      setMessage('Transfer Successful!');
    } catch (error) {
      setMessage('Error: Insufficient funds or system error.');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transfer Assets</h1>
      {message && <div className="p-3 mb-4 bg-blue-50 text-blue-800 rounded">{message}</div>}
      <form onSubmit={handleTransfer} className="space-y-4 bg-white p-6 rounded shadow border">
        <div>
          <label className="block text-sm font-bold mb-1">Select Asset</label>
          <select className="w-full p-2 border rounded" onChange={(e) => setSelectedAsset(Number(e.target.value))}>
            {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold">From</label><select className="w-full p-2 border rounded" value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))}>{bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
            <div><label className="block text-sm font-bold">To</label><select className="w-full p-2 border rounded" value={toBase} onChange={(e) => setToBase(Number(e.target.value))}>{bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Quantity</label>
          <input type="number" className="w-full p-2 border rounded" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">Move Assets</button>
      </form>
    </div>
  );
}