import React, { useState, useEffect } from 'react';
import { useBrandingConfig } from '../../hooks/useBrandingConfig';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { BrandingConfig } from '../../types';
import { Save, CheckCircle, Phone, Mail, Link as LinkIcon, Trash2, Plus, GripVertical, Image } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

export default function BrandingAdmin() {
  const { config, loading } = useBrandingConfig();
  const [formData, setFormData] = useState<BrandingConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'logos' | 'contact' | 'social'>('logos');

  useEffect(() => {
    if (config) {
      setFormData(JSON.parse(JSON.stringify(config)));
    }
  }, [config]);

  if (loading || !formData) return <div className="p-8 text-center">Loading...</div>;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'config', 'branding'), formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Failed to save branding configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSocialChange = (index: number, field: keyof BrandingConfig['socialLinks'][0], value: any) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const moveSocial = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newLinks = [...formData.socialLinks];
      const temp = newLinks[index - 1];
      newLinks[index - 1] = newLinks[index];
      newLinks[index] = temp;
      // update order
      newLinks.forEach((link, i) => link.order = i);
      setFormData({ ...formData, socialLinks: newLinks });
    } else if (direction === 'down' && index < formData.socialLinks.length - 1) {
      const newLinks = [...formData.socialLinks];
      const temp = newLinks[index + 1];
      newLinks[index + 1] = newLinks[index];
      newLinks[index] = temp;
      newLinks.forEach((link, i) => link.order = i);
      setFormData({ ...formData, socialLinks: newLinks });
    }
  };

  const addSocial = () => {
    const newLinks = [...formData.socialLinks, {
      id: Date.now().toString(),
      platform: 'New Platform',
      url: 'https://',
      enabled: true,
      order: formData.socialLinks.length
    }];
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const removeSocial = (index: number) => {
    const newLinks = formData.socialLinks.filter((_, i) => i !== index);
    newLinks.forEach((link, i) => link.order = i);
    setFormData({ ...formData, socialLinks: newLinks });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Branding & Contact</h1>
          <p className="text-slate-500">Manage contact details and social media links.<br/><span className="text-xs text-blue-600 font-medium">Logos are managed via local files at <code>src/assets/branding/</code></span></p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#1763B6] hover:bg-[#145096] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-70 shadow-sm"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saveSuccess ? (
            <CheckCircle className="w-5 h-5 text-green-300" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'logos', label: 'Logos & Branding', icon: Image },
            { id: 'contact', label: 'Contact Details', icon: Phone },
            { id: 'social', label: 'Social Media', icon: LinkIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-b-2 border-[#1763B6] text-[#1763B6] bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Logos Tab */}
          {activeTab === 'logos' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-semibold text-slate-800 border-b pb-2 mb-4">Site Logos</h3>
                <p className="text-sm text-slate-500 mb-6">Upload logos for each area of the platform. Images are stored in Firebase Storage and applied automatically. If no logo is uploaded, the local fallback file is used.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploader
                    label="Header Logo (Public Website)"
                    value={formData.headerLogoUrl || ''}
                    onChange={(url) => setFormData({ ...formData, headerLogoUrl: url })}
                    folder="branding"
                    maxDimension={400}
                    recommendedSize="320 × 90 px"
                    recommendedFormat="SVG or transparent PNG"
                    previewClassName="max-h-[60px] max-w-[220px] object-contain"
                  />
                  <ImageUploader
                    label="Footer Logo (Public Website)"
                    value={formData.footerLogoUrl || ''}
                    onChange={(url) => setFormData({ ...formData, footerLogoUrl: url })}
                    folder="branding"
                    maxDimension={400}
                    recommendedSize="320 × 90 px"
                    recommendedFormat="SVG or transparent PNG (white version)"
                    previewClassName="max-h-[60px] max-w-[220px] object-contain bg-slate-700 p-2 rounded"
                  />
                  <ImageUploader
                    label="Admin Portal Logo"
                    value={formData.adminPortalLogoUrl || ''}
                    onChange={(url) => setFormData({ ...formData, adminPortalLogoUrl: url })}
                    folder="branding"
                    maxDimension={400}
                    recommendedSize="320 × 90 px"
                    recommendedFormat="SVG or transparent PNG (white version)"
                    previewClassName="max-h-[60px] max-w-[220px] object-contain bg-slate-800 p-2 rounded"
                  />
                  <ImageUploader
                    label="Student Portal Logo"
                    value={formData.studentPortalLogoUrl || ''}
                    onChange={(url) => setFormData({ ...formData, studentPortalLogoUrl: url })}
                    folder="branding"
                    maxDimension={400}
                    recommendedSize="320 × 90 px"
                    recommendedFormat="SVG or transparent PNG (white version)"
                    previewClassName="max-h-[60px] max-w-[220px] object-contain bg-slate-800 p-2 rounded"
                  />
                  <ImageUploader
                    label="About Page — Mentor Photo"
                    value={formData.aboutMentorPhotoUrl || ''}
                    onChange={(url) => setFormData({ ...formData, aboutMentorPhotoUrl: url })}
                    folder="branding"
                    maxDimension={600}
                    recommendedSize="600 × 600 px"
                    recommendedFormat="PNG or JPG (professional headshot)"
                    previewClassName="w-36 h-36 object-cover rounded-xl"
                  />
                  <ImageUploader
                    label="Favicon"
                    value={formData.faviconUrl || ''}
                    onChange={(url) => setFormData({ ...formData, faviconUrl: url })}
                    folder="branding"
                    maxDimension={64}
                    recommendedSize="64 × 64 px"
                    recommendedFormat="ICO, PNG, or SVG"
                    previewClassName="w-12 h-12 object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Legacy logo notice removed — logos now managed above via Firebase Storage */}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Phone Numbers</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Mobile</label>
                  <input
                    type="text"
                    value={formData.primaryMobile}
                    onChange={(e) => setFormData({ ...formData, primaryMobile: e.target.value })}
                    className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Mobile</label>
                  <input
                    type="text"
                    value={formData.secondaryMobile}
                    onChange={(e) => setFormData({ ...formData, secondaryMobile: e.target.value })}
                    className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Email Addresses</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">General Info Email</label>
                  <input
                    type="email"
                    value={formData.generalEmail}
                    onChange={(e) => setFormData({ ...formData, generalEmail: e.target.value })}
                    className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sales Email</label>
                  <input
                    type="email"
                    value={formData.salesEmail}
                    onChange={(e) => setFormData({ ...formData, salesEmail: e.target.value })}
                    className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="space-y-4 md:col-span-2 mt-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Location & Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Physical Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Link</label>
                      <input
                        type="text"
                        value={formData.googleMapsLink}
                        onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                        className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Business Hours</label>
                      <input
                        type="text"
                        value={formData.businessHours}
                        onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                        className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="max-w-4xl">
              <div className="space-y-3">
                {formData.socialLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => moveSocial(index, 'up')} 
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => moveSocial(index, 'down')}
                        disabled={index === formData.socialLinks.length - 1}
                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="col-span-1">
                        <select
                          value={link.platform}
                          onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                          className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] text-sm"
                        >
                          <option>Facebook</option>
                          <option>Instagram</option>
                          <option>LinkedIn</option>
                          <option>YouTube</option>
                          <option>Twitter/X</option>
                          <option>Threads</option>
                          <option>Telegram</option>
                          <option>WhatsApp</option>
                          <option>Discord</option>
                          <option>GitHub</option>
                          <option>Medium</option>
                          <option>Pinterest</option>
                        </select>
                      </div>
                      
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                          placeholder="https://"
                          className="w-full rounded-lg border-slate-300 focus:border-[#1763B6] text-sm"
                        />
                      </div>
                      
                      <div className="col-span-1 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={link.enabled}
                            onChange={(e) => handleSocialChange(index, 'enabled', e.target.checked)}
                            className="rounded border-slate-300 text-[#1763B6] focus:ring-[#1763B6]"
                          />
                          <span className="text-sm font-medium text-slate-700">Enabled</span>
                        </label>
                        
                        <button
                          onClick={() => removeSocial(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={addSocial}
                className="mt-4 flex items-center gap-2 text-[#1763B6] font-semibold text-sm hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-dashed border-blue-300"
              >
                <Plus className="w-4 h-4" />
                Add Social Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
