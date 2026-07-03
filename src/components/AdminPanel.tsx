import React, { useState, useEffect } from 'react';
import { Briefcase, Settings, Plus, Save, Trash2, Check, Users, Edit2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

interface AdminPanelProps {
    taxRates: {
    baseDutyBeans: number;
    baseDutyMaize: number;
    baseDutyCassava: number;
    baseDutyVegetables: number;
    baseDutyTextiles: number;
    baseDutyElectronics: number;
    baseDutyAgriInputs: number;
    vatDrc: number;
    vatRwanda: number;
    occFeeDrc: number;
    whNonRegDrc: number;
    whNonRegRwanda: number;
    whRegDrc: number;
  };
  setTaxRates: (rates: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  taxRates,
  setTaxRates
}) => {
  
  // Active Admin Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'rates' | 'products' | 'users' | 'professionals'>('rates');

  // Rates Form State
  const [ratesForm, setRatesForm] = useState(taxRates);
  const [isSavedRates, setIsSavedRates] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdHsCode, setNewProdHsCode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'agriculture' | 'merchandise'>('agriculture');
  const [newProdDuty, setNewProdDuty] = useState<number>(25);
  const [newProdStr, setNewProdStr] = useState<boolean>(true);

  // Users and Professionals state
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  
  // New Professional Form State
  const [newProfName, setNewProfName] = useState('');
  const [newProfType, setNewProfType] = useState<'customs_agent' | 'logistics'>('customs_agent');
  const [newProfCompany, setNewProfCompany] = useState('');
  const [newProfLocation, setNewProfLocation] = useState('');
  const [newProfEmail, setNewProfEmail] = useState('');
  const [newProfPhone, setNewProfPhone] = useState('');

  // Fetch data on mount
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'small_trader' | 'corporate'>('small_trader');

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', role: '' });
  
  useEffect(() => {
    const fetchData = async () => {
      try {        const [usersRes, profsRes, prodsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/professionals'),
          fetch('/api/products')
        ]);
        if (usersRes.ok) setUsers(await usersRes.json());
        if (profsRes.ok) setProfessionals(await profsRes.json());
        if (prodsRes.ok) {
           const d = await prodsRes.json();
           setProducts(d.products || []);
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/taxes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratesForm),
      });
      if (response.ok) {
        const data = await response.json();
        setTaxRates(data.settings);
        setIsSavedRates(true);

        // Confetti success trigger!
        confetti({
          particleCount: 40,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#10b981', '#ffffff']
        });

        setTimeout(() => setIsSavedRates(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save rates:', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdHsCode) return;

    const uniqueId = newProdName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
    
    const newProduct = {
      id: uniqueId,
      name: newProdName,
      hsCode: newProdHsCode,
      category: newProdCategory,
      baseDutyRate: newProdDuty / 100,
      isEacStrEligible: newProdStr,
      notes: "Custom product added via Admin Panel."
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        setProducts([...products, newProduct]);
        // Form resets
        setNewProdName('');
        setNewProdHsCode('');
        setNewProdDuty(25);
        setNewProdStr(true);

        // Fire Confetti!
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#10b981', '#34d399', '#ffffff']
        });
      }
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        await fetch(`/api/products?id=${prodId}`, { method: 'DELETE' });
        setProducts(products.filter(p => p.id !== prodId));
        Swal.fire('Deleted!', 'Product deleted successfully.', 'success');
      } catch (err) {
        console.error('Failed to delete product:', err);
        Swal.fire('Error', 'Failed to delete product.', 'error');
      }
    }
  };

  const handleUpdateUser = async (userId: string, updateData: any) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: userId, ...updateData })
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map(u => u._id === userId ? updated : u));
        setEditingUserId(null);
        Swal.fire('Success', 'User updated successfully', 'success');
      } else {
        const err = await res.json();
        Swal.fire('Error', err.error || 'Failed to update user', 'error');
      }
    } catch (err) {
      console.error('Failed to update user:', err);
      Swal.fire('Error', 'Failed to update user', 'error');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: 'admin',
          role: newUserRole
        })
      });
      if (res.ok) {
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) setUsers(await usersRes.json());
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole('small_trader');
        Swal.fire('Success', 'User added successfully', 'success');
      } else {
        const err = await res.json();
        Swal.fire('Error', err.error || 'Failed to add user', 'error');
      }
    } catch (err) {
      console.error('Failed to add user:', err);
      Swal.fire('Error', 'Failed to add user', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
        setUsers(users.filter(u => u._id !== userId));
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (err) {
        console.error('Failed to delete user:', err);
        Swal.fire('Error', 'Failed to delete user', 'error');
      }
    }
  };

  const handleAddProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName || !newProfCompany || !newProfEmail) return;

    const newProfessional = {
      name: newProfName,
      type: newProfType,
      company: newProfCompany,
      location: newProfLocation,
      email: newProfEmail,
      phone: newProfPhone,
      verified: true
    };

    try {
      const response = await fetch('/api/professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfessional)
      });

      if (response.ok) {
        const added = await response.json();
        setProfessionals([...professionals, added]);
        
        // Reset form
        setNewProfName('');
        setNewProfCompany('');
        setNewProfLocation('');
        setNewProfEmail('');
        setNewProfPhone('');
      }
    } catch (err) {
      console.error('Failed to add professional:', err);
    }
  };

  const handleDeleteProfessional = async (profId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this professional?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        await fetch(`/api/professionals?id=${profId}`, { method: 'DELETE' });
        setProfessionals(professionals.filter(p => p._id !== profId));
        Swal.fire('Deleted!', 'Professional has been deleted.', 'success');
      } catch (err) {
        console.error('Failed to delete professional:', err);
        Swal.fire('Error', 'Failed to delete professional', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* SIDEBAR */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="glass-panel rounded-3xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-900 sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white leading-tight">
                Admin Panel
              </h2>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                System Control
              </p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveSubTab('rates')}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer w-full text-left ${
                activeSubTab === 'rates'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Settings className="h-4 w-4" />
              Tax Rates
            </button>
            <button
              onClick={() => setActiveSubTab('products')}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer w-full text-left ${
                activeSubTab === 'products'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Plus className="h-4 w-4" />
              Products Registry
            </button>
            <button
            onClick={() => setActiveSubTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeSubTab === 'users' 
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Users className={`h-4 w-4 ${activeSubTab === 'users' ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}`} />
            Users
          </button>
            <button
              onClick={() => setActiveSubTab('professionals')}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer w-full text-left ${
                activeSubTab === 'professionals'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Professionals
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 glass-panel rounded-3xl p-5 md:p-8 shadow-sm border border-zinc-100 dark:border-zinc-900">

        {/* SUBTAB CONTENT 1: Rates settings */}
        {activeSubTab === 'rates' && (
          <form onSubmit={handleSaveRates} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Duties */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Customs Duties by Product</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">Beans Import Duty (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.baseDutyBeans * 100}
                      onChange={(e) => setRatesForm({...ratesForm, baseDutyBeans: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">Maize Import Duty (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.baseDutyMaize * 100}
                      onChange={(e) => setRatesForm({...ratesForm, baseDutyMaize: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">Cassava Import Duty (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.baseDutyCassava * 100}
                      onChange={(e) => setRatesForm({...ratesForm, baseDutyCassava: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">Vegetables Duty (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.baseDutyVegetables * 100}
                      onChange={(e) => setRatesForm({...ratesForm, baseDutyVegetables: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">Textiles Duty (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.baseDutyTextiles * 100}
                      onChange={(e) => setRatesForm({...ratesForm, baseDutyTextiles: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">Electronics Duty (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.baseDutyElectronics * 100}
                      onChange={(e) => setRatesForm({...ratesForm, baseDutyElectronics: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: VAT & Administrative Fees */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">VAT & Regional Handling Fees</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">DRC VAT Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.vatDrc}
                      onChange={(e) => setRatesForm({...ratesForm, vatDrc: parseFloat(e.target.value) || 0})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">Rwanda VAT Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.vatRwanda}
                      onChange={(e) => setRatesForm({...ratesForm, vatRwanda: parseFloat(e.target.value) || 0})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">DRC OCC Handling Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ratesForm.occFeeDrc}
                      onChange={(e) => setRatesForm({...ratesForm, occFeeDrc: parseFloat(e.target.value) || 0})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">WHT DRC (Reg/%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ratesForm.whRegDrc * 100}
                      onChange={(e) => setRatesForm({...ratesForm, whRegDrc: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">WHT DRC (Non-Reg/%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.whNonRegDrc * 100}
                      onChange={(e) => setRatesForm({...ratesForm, whNonRegDrc: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">WHT Rwa (Non-Reg/%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={ratesForm.whNonRegRwanda * 100}
                      onChange={(e) => setRatesForm({...ratesForm, whNonRegRwanda: parseFloat(e.target.value) / 100})}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500 text-zinc-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 border-t border-zinc-100 dark:border-zinc-850 pt-4">
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:brightness-105 transition-all cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save Rate Configurations
              </button>
              {isSavedRates && (
                <span className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 animate-pulse">
                  <Check className="h-4 w-4" />
                  Rates configured successfully!
                </span>
              )}
            </div>
          </form>
        )}

        {/* SUBTAB CONTENT 2: Products Registry */}
        {activeSubTab === 'products' && (
          <div className="space-y-6">
            {/* Add product form */}
            <form onSubmit={handleAddProduct} className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-850 space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Add New Product Definition</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rice"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">HS Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1006.30.00"
                    value={newProdHsCode}
                    onChange={(e) => setNewProdHsCode(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="agriculture">Agriculture</option>
                    <option value="merchandise">Merchandise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Base Duty (%)</label>
                  <input
                    type="number"
                    value={newProdDuty}
                    onChange={(e) => setNewProdDuty(parseInt(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-855 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newProdStr"
                    checked={newProdStr}
                    onChange={(e) => setNewProdStr(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-500 cursor-pointer"
                  />
                  <label htmlFor="newProdStr" className="text-xs font-semibold text-zinc-650 dark:text-zinc-400 cursor-pointer">
                    Eligible for EAC Simplified Trade Regime (STR) duty-free treatment
                  </label>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Register Product
                </button>
              </div>
            </form>

            {/* List products */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Registered Products Registry ({products.length})</h3>
              
              <div className="overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-850">
                <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                  <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3">HS Code</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-center">Base Duty</th>
                      <th className="px-4 py-3 text-center">EAC STR Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 bg-white dark:bg-zinc-950">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                        <td className="px-4 py-3 font-bold text-zinc-800 dark:text-zinc-200">
                          {prod.name || prod.id}
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px]">
                          {prod.hsCode}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {prod.category}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                          {(prod.baseDutyRate * 100)}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          {prod.isEacStrEligible ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                              Eligible
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-450 dark:text-zinc-500">
                              Standard Only
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Subtab Removed */}

        {/* SUBTAB CONTENT 4: Users Management */}
        {activeSubTab === 'users' && (
          <div className="space-y-6">
            <form onSubmit={handleAddUser} className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-850 space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Add New User</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="small_trader">Small Trader</option>
                    <option value="corporate">Corporate</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-855 pt-3">
                <span className="text-xs font-semibold text-zinc-500">Default password is <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">admin</code></span>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
              </div>
            </form>

            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-6">Registered Users ({users.length})</h3>
            
            <div className="overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-850">
              <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3 text-center">Role</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 bg-white dark:bg-zinc-950">
                  {users.map((user) => {
                    const isEditing = editingUserId === user._id;
                    return (
                    <tr key={user._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                      <td className="px-4 py-3 font-bold text-zinc-800 dark:text-zinc-200">
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-full"
                            value={editUserForm.name}
                            onChange={(e) => setEditUserForm({...editUserForm, name: e.target.value})}
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px]">
                        {isEditing ? (
                          <input 
                            type="email" 
                            className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-full"
                            value={editUserForm.email}
                            onChange={(e) => setEditUserForm({...editUserForm, email: e.target.value})}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <select
                            value={editUserForm.role}
                            onChange={(e) => setEditUserForm({...editUserForm, role: e.target.value})}
                            className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 w-full"
                          >
                            <option value="small_trader">Small Trader</option>
                            <option value="corporate">Corporate</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className="capitalize">{user.role?.replace('_', ' ')}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdateUser(user._id, editUserForm)}
                              className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded cursor-pointer"
                              title="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUserId(user._id);
                                setEditUserForm({ name: user.name, email: user.email, role: user.role });
                              }}
                              className="p-1 text-zinc-400 hover:text-brand-500 transition-colors cursor-pointer"
                              title="Edit User"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB CONTENT 5: Professionals Management */}
        {activeSubTab === 'professionals' && (
          <div className="space-y-6">
            <form onSubmit={handleAddProfessional} className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-850 space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Add New Professional</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={newProfName}
                    onChange={(e) => setNewProfName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={newProfCompany}
                    onChange={(e) => setNewProfCompany(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Type</label>
                  <select
                    value={newProfType}
                    onChange={(e) => setNewProfType(e.target.value as any)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="customs_agent">Customs Agent</option>
                    <option value="logistics">Logistics Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={newProfLocation}
                    onChange={(e) => setNewProfLocation(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newProfEmail}
                    onChange={(e) => setNewProfEmail(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newProfPhone}
                    onChange={(e) => setNewProfPhone(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-zinc-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-zinc-150 dark:border-zinc-855 pt-3">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Professional
                </button>
              </div>
            </form>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Professionals Directory ({professionals.length})</h3>
              
              <div className="overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-850">
                <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                  <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 bg-white dark:bg-zinc-950">
                    {professionals.map((prof) => (
                      <tr key={prof._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                        <td className="px-4 py-3 font-bold text-zinc-800 dark:text-zinc-200">{prof.name}</td>
                        <td className="px-4 py-3">{prof.company}</td>
                        <td className="px-4 py-3 capitalize">{prof.type.replace('_', ' ')}</td>
                        <td className="px-4 py-3">{prof.email}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteProfessional(prof._id)}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
