import React, { useState, useEffect } from 'react';
import { useDB } from '../../hooks/useDB';
import { useServerAccessConfig } from '../../hooks/useServerAccessConfig';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { Server, Settings, Save, Plus, Trash2, Edit2, CheckCircle, XCircle, Search, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { ServerEnquiry, ServerAccessConfig, ServerPlan } from '../../types';

export default function ServerAccessAdmin() {
  const mockDb = useDB();
  const [activeTab, setActiveTab] = useState<'config' | 'enquiries'>('config');
  const { config: firebaseConfig, loading: configLoading } = useServerAccessConfig();
  
  // Config state
  const [config, setConfig] = useState<ServerAccessConfig | null>(null);

  useEffect(() => {
    if (firebaseConfig) {
      setConfig(JSON.parse(JSON.stringify(firebaseConfig)));
    }
  }, [firebaseConfig]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Expanded states
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedIndianPlan, setExpandedIndianPlan] = useState<number | null>(null);
  const [expandedIntlPlan, setExpandedIntlPlan] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<ServerEnquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'serverEnquiries'), (snapshot) => {
      const eqData: ServerEnquiry[] = [];
      snapshot.forEach(doc => {
        eqData.push({ id: doc.id, ...doc.data() } as ServerEnquiry);
      });
      eqData.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
      setEnquiries(eqData);
    }, (error) => {
      console.log('Firebase fetch failed, using mock data', error);
      if (mockDb.serverEnquiries) { 
        setEnquiries(mockDb.serverEnquiries);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      if (config) {
        await setDoc(doc(db, 'config', 'serverAccess'), config as any);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save config');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, 'serverEnquiries', id);
      await updateDoc(docRef, { status: newStatus });
    } catch (e) {
      console.error(e);
      setEnquiries(prev => prev.map(eq => eq.id === id ? { ...eq, status: newStatus as any } : eq));
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await deleteDoc(doc(db, 'serverEnquiries', id));
    } catch (e) {
      console.error(e);
      setEnquiries(prev => prev.filter(eq => eq.id !== id));
    }
  };

  // Helper arrays
  const moveItem = (arrayName: 'indianPricing' | 'internationalPricing' | 'features' | 'faq', index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const newConfig = { ...config };
    const arr = [...newConfig[arrayName]] as any[];
    if (direction === 'up' && index > 0) {
      const temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
    } else if (direction === 'down' && index < arr.length - 1) {
      const temp = arr[index];
      arr[index] = arr[index + 1];
      arr[index + 1] = temp;
    }
    
    // update order if it's a plan
    if (arrayName === 'indianPricing' || arrayName === 'internationalPricing') {
        arr.forEach((p, i) => { if(p.order !== undefined) p.order = i; });
    }
    
    (newConfig as any)[arrayName] = arr;
    setConfig(newConfig);
  };

  const addIndianPlan = () => {
    if (!config) return;
    const newConfig = { ...config };
    newConfig.indianPricing.push({
      id: 'plan_' + Date.now(),
      duration: 'New Plan',
      price: '0',
      description: 'Plan description',
      order: newConfig.indianPricing.length
    });
    setConfig(newConfig);
    setExpandedIndianPlan(newConfig.indianPricing.length - 1);
  };

  const addIntlPlan = () => {
    if (!config) return;
    const newConfig = { ...config };
    newConfig.internationalPricing.push({
      id: 'plan_' + Date.now(),
      duration: 'New Plan',
      price: '0',
      description: 'Plan description',
      order: newConfig.internationalPricing.length
    });
    setConfig(newConfig);
    setExpandedIntlPlan(newConfig.internationalPricing.length - 1);
  };

  const addFeature = () => {
    if (!config) return;
    setConfig({ ...config, features: [...config.features, 'New feature'] });
  };

  const addFaq = () => {
    if (!config) return;
    const newConfig = { ...config };
    newConfig.faq.push({ question: 'New Question', answer: 'New Answer' });
    setConfig(newConfig);
    setExpandedFaq(newConfig.faq.length - 1);
  };

  const deleteItem = (arrayName: 'indianPricing' | 'internationalPricing' | 'features' | 'faq', index: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    if (!config) return;
    const newConfig = { ...config };
    const arr = [...newConfig[arrayName]];
    arr.splice(index, 1);
    (newConfig as any)[arrayName] = arr;
    setConfig(newConfig);
  };

  const filteredEnquiries = enquiries.filter(eq => {
    const matchesSearch = 
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.phone.includes(searchTerm) ||
      (eq.country || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || eq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!config) return <div className="p-8 flex items-center justify-center min-h-[400px]">Loading configuration...</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Server className="w-6 h-6 text-[#1763B6]" />
            Server Access Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage frontend configuration and view access requests.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('config')}
          className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'config' ? 'border-[#1763B6] text-[#1763B6]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-2"><Settings className="w-4 h-4"/> Page Configuration</div>
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'enquiries' ? 'border-[#1763B6] text-[#1763B6]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-2"><Server className="w-4 h-4"/> Enquiries ({enquiries.length})</div>
        </button>
      </div>

      {activeTab === 'config' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-10">
            <div>
              <p className="font-semibold text-slate-800">Save Configuration</p>
              <p className="text-xs text-slate-500">Publish your changes to the live website instantly.</p>
            </div>
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#1763B6] text-white font-medium rounded-lg hover:bg-[#145096] transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
            >
              {saveSuccess ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
            </button>
          </div>

          {/* Hero Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={config.hero.title}
                  onChange={e => setConfig({...config, hero: {...config.hero, title: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                <textarea 
                  value={config.hero.subtitle}
                  onChange={e => setConfig({...config, hero: {...config.hero, subtitle: e.target.value}})}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Server Details */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Server Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={config.serverDetails.name}
                  onChange={e => setConfig({...config, serverDetails: {...config.serverDetails, name: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Version</label>
                <input 
                  type="text" 
                  value={config.serverDetails.version}
                  onChange={e => setConfig({...config, serverDetails: {...config.serverDetails, version: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Landscape</label>
                <input 
                  type="text" 
                  value={config.serverDetails.landscape}
                  onChange={e => setConfig({...config, serverDetails: {...config.serverDetails, landscape: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Access Type</label>
                <input 
                  type="text" 
                  value={config.serverDetails.accessType}
                  onChange={e => setConfig({...config, serverDetails: {...config.serverDetails, accessType: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
                <input 
                  type="text" 
                  value={config.serverDetails.availability}
                  onChange={e => setConfig({...config, serverDetails: {...config.serverDetails, availability: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <input 
                  type="text" 
                  value={config.serverDetails.status}
                  onChange={e => setConfig({...config, serverDetails: {...config.serverDetails, status: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  value={config.serverDetails.description}
                  onChange={e => setConfig({...config, serverDetails: {...config.serverDetails, description: e.target.value}})}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing - Indian */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Indian Pricing Plans</h2>
            <div className="space-y-3">
              {config.indianPricing.map((plan, index) => (
                <div key={plan.id || index} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveItem('indianPricing', index, 'up')} disabled={index === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => moveItem('indianPricing', index, 'down')} disabled={index === config.indianPricing.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                      </div>
                      <span className="font-semibold text-slate-700">{plan.duration} - {plan.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteItem('indianPricing', index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={() => setExpandedIndianPlan(expandedIndianPlan === index ? null : index)} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded">
                        {expandedIndianPlan === index ? <ChevronUp className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {expandedIndianPlan === index && (
                    <div className="p-4 bg-white border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                        <input type="text" value={plan.duration} onChange={(e) => {
                          const newConfig = {...config};
                          newConfig.indianPricing[index].duration = e.target.value;
                          setConfig(newConfig);
                        }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                        <input type="text" value={plan.price} onChange={(e) => {
                          const newConfig = {...config};
                          newConfig.indianPricing[index].price = e.target.value;
                          setConfig(newConfig);
                        }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <input type="text" value={plan.description} onChange={(e) => {
                          const newConfig = {...config};
                          newConfig.indianPricing[index].description = e.target.value;
                          setConfig(newConfig);
                        }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={addIndianPlan} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#1763B6] hover:text-[#1763B6] transition-colors flex items-center justify-center gap-2 mt-2">
                <Plus className="w-4 h-4" /> Add Indian Plan
              </button>
            </div>
          </div>

          {/* Pricing - International */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">International Pricing Plans</h2>
            <div className="space-y-3">
              {config.internationalPricing.map((plan, index) => (
                <div key={plan.id || index} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveItem('internationalPricing', index, 'up')} disabled={index === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => moveItem('internationalPricing', index, 'down')} disabled={index === config.internationalPricing.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                      </div>
                      <span className="font-semibold text-slate-700">{plan.duration} - {plan.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteItem('internationalPricing', index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={() => setExpandedIntlPlan(expandedIntlPlan === index ? null : index)} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded">
                        {expandedIntlPlan === index ? <ChevronUp className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {expandedIntlPlan === index && (
                    <div className="p-4 bg-white border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                        <input type="text" value={plan.duration} onChange={(e) => {
                          const newConfig = {...config};
                          newConfig.internationalPricing[index].duration = e.target.value;
                          setConfig(newConfig);
                        }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                        <input type="text" value={plan.price} onChange={(e) => {
                          const newConfig = {...config};
                          newConfig.internationalPricing[index].price = e.target.value;
                          setConfig(newConfig);
                        }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <input type="text" value={plan.description} onChange={(e) => {
                          const newConfig = {...config};
                          newConfig.internationalPricing[index].description = e.target.value;
                          setConfig(newConfig);
                        }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={addIntlPlan} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#1763B6] hover:text-[#1763B6] transition-colors flex items-center justify-center gap-2 mt-2">
                <Plus className="w-4 h-4" /> Add International Plan
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Features List</h2>
            <div className="space-y-2">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button onClick={() => moveItem('features', index, 'up')} disabled={index === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => moveItem('features', index, 'down')} disabled={index === config.features.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                  </div>
                  <input 
                    type="text" 
                    value={feature}
                    onChange={(e) => {
                      const newConfig = {...config};
                      newConfig.features[index] = e.target.value;
                      setConfig(newConfig);
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                  />
                  <button onClick={() => deleteItem('features', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={addFeature} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#1763B6] hover:text-[#1763B6] transition-colors flex items-center justify-center gap-2 mt-4">
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {config.faq.map((faqItem, index) => (
                <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-50 p-3">
                    <div className="flex items-center gap-3 flex-1 pr-4">
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => moveItem('faq', index, 'up')} disabled={index === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => moveItem('faq', index, 'down')} disabled={index === config.faq.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                      </div>
                      <span className="font-medium text-slate-700 truncate">{faqItem.question}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => deleteItem('faq', index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={() => setExpandedFaq(expandedFaq === index ? null : index)} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded">
                        {expandedFaq === index ? <ChevronUp className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {expandedFaq === index && (
                    <div className="p-4 bg-white border-t border-slate-200 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                        <input type="text" value={faqItem.question} onChange={(e) => {
                          const newConfig = {...config};
                          newConfig.faq[index].question = e.target.value;
                          setConfig(newConfig);
                        }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
                        <textarea value={faqItem.answer} rows={3} onChange={(e) => {
                          const newConfig = {...config};
                          newConfig.faq[index].answer = e.target.value;
                          setConfig(newConfig);
                        }} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={addFaq} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#1763B6] hover:text-[#1763B6] transition-colors flex items-center justify-center gap-2 mt-2">
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
                <input 
                  type="text" 
                  value={config.paymentDetails.upiId}
                  onChange={e => setConfig({...config, paymentDetails: {...config.paymentDetails, upiId: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
                <input 
                  type="text" 
                  value={config.paymentDetails.accountName}
                  onChange={e => setConfig({...config, paymentDetails: {...config.paymentDetails, accountName: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={config.paymentDetails.phoneNumber}
                  onChange={e => setConfig({...config, paymentDetails: {...config.paymentDetails, phoneNumber: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                <input 
                  type="text" 
                  value={config.paymentDetails.whatsappNumber}
                  onChange={e => setConfig({...config, paymentDetails: {...config.paymentDetails, whatsappNumber: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="text" 
                  value={config.paymentDetails.email}
                  onChange={e => setConfig({...config, paymentDetails: {...config.paymentDetails, email: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Instructions</label>
                <textarea 
                  value={config.paymentDetails.instructions}
                  onChange={e => setConfig({...config, paymentDetails: {...config.paymentDetails, instructions: e.target.value}})}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Activation Notes</label>
                <textarea 
                  value={config.paymentDetails.activationNotes}
                  onChange={e => setConfig({...config, paymentDetails: {...config.paymentDetails, activationNotes: e.target.value}})}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={config.contact.phone}
                  onChange={e => setConfig({...config, contact: {...config.contact, phone: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                <input 
                  type="text" 
                  value={config.contact.whatsapp}
                  onChange={e => setConfig({...config, contact: {...config.contact, whatsapp: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="text" 
                  value={config.contact.email}
                  onChange={e => setConfig({...config, contact: {...config.contact, email: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Office Timing</label>
                <input 
                  type="text" 
                  value={config.contact.officeTiming}
                  onChange={e => setConfig({...config, contact: {...config.contact, officeTiming: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Support Timing</label>
                <input 
                  type="text" 
                  value={config.contact.supportTiming}
                  onChange={e => setConfig({...config, contact: {...config.contact, supportTiming: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      )}
      {activeTab === 'enquiries' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1763B6] outline-none transition-all text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#1763B6] outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Payment Pending">Payment Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Plan / Purpose</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No server enquiries found.
                      </td>
                    </tr>
                  ) : (
                    filteredEnquiries.map(eq => (
                      <tr key={eq.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 align-top">
                          {new Date(eq.createdTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="font-bold text-slate-800">{eq.name}</div>
                          <div>{eq.email}</div>
                          <div>{eq.phone}</div>
                          {eq.country && <div className="text-xs text-slate-400 mt-1 uppercase">{eq.country}</div>}
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="font-medium text-[#1763B6]">{eq.plan || 'Not Selected'}</div>
                          <div className="text-xs text-slate-500">{eq.purpose}</div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <select
                            value={eq.status}
                            onChange={(e) => handleStatusChange(eq.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1 rounded-full border outline-none cursor-pointer ${
                              eq.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              eq.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Payment Pending">Payment Pending</option>
                            <option value="Payment Received">Payment Received</option>
                            <option value="Credentials Sent">Credentials Sent</option>
                            <option value="Completed">Completed</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 align-top text-right space-x-2">
                           <button onClick={() => handleDeleteEnquiry(eq.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
