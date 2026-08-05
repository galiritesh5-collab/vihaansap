import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, ArrowLeft, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { SAP_COURSES } from '../../data';
import ImageUploader from './ImageUploader';

interface CourseBuilderProps {
  initialData: any;
  onClose: () => void;
  onSave: (course: any) => void;
}

const TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'info', label: 'Course Info' },
  { id: 'features', label: 'Features' },
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'mentor', label: 'Mentor' },
  { id: 'faq', label: 'FAQ' },
];

export default function CourseBuilder({ initialData, onClose, onSave }: CourseBuilderProps) {
  const db = useDB();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<any>({
    status: 'Published',
    category: 'Functional',
    level: 'Beginner',
    rating: 4.5,
    fullDetails: [],
    learningOutcomes: [],
    modules: [],
    faqs: [],
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayAdd = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: [...(prev[field] || []), value] }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleArrayChange = (field: string, index: number, newValue: string) => {
    setFormData((prev: any) => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = newValue;
      return { ...prev, [field]: newArray };
    });
  };

  const handleArrayMove = (field: string, index: number, direction: 'up' | 'down') => {
    setFormData((prev: any) => {
      const newArray = [...(prev[field] || [])];
      if (direction === 'up' && index > 0) {
        [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
      } else if (direction === 'down' && index < newArray.length - 1) {
        [newArray[index + 1], newArray[index]] = [newArray[index], newArray[index + 1]];
      }
      return { ...prev, [field]: newArray };
    });
  };

  const handleModuleAdd = () => {
    handleArrayAdd('modules', { title: 'New Module', duration: '5 Days', status: 'pending' });
  };

  const handleModuleChange = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newModules = [...(prev.modules || [])];
      newModules[index] = { ...newModules[index], [field]: value };
      return { ...prev, modules: newModules };
    });
  };

  const handleTopicAdd = (moduleIndex: number) => {
    setFormData((prev: any) => {
      const newModules = [...(prev.modules || [])];
      newModules[moduleIndex].topics = [...(newModules[moduleIndex].topics || []), 'New Topic'];
      return { ...prev, modules: newModules };
    });
  };

  const handleTopicChange = (moduleIndex: number, topicIndex: number, value: string) => {
    setFormData((prev: any) => {
      const newModules = [...(prev.modules || [])];
      const newTopics = [...(newModules[moduleIndex].topics || [])];
      newTopics[topicIndex] = value;
      newModules[moduleIndex].topics = newTopics;
      return { ...prev, modules: newModules };
    });
  };

  const handleTopicRemove = (moduleIndex: number, topicIndex: number) => {
    setFormData((prev: any) => {
      const newModules = [...(prev.modules || [])];
      newModules[moduleIndex].topics = newModules[moduleIndex].topics.filter((_: any, i: number) => i !== topicIndex);
      return { ...prev, modules: newModules };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, updatedAt: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-lg text-slate-800">{formData.id ? 'Edit Course' : 'Create Course'}</h2>
            <p className="text-xs text-slate-500">{formData.name || 'Untitled Course'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${formData.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {formData.status || 'Published'}
          </span>
          <button onClick={handleSubmit} className="bg-[#1763B6] hover:bg-[#277EDC] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Course
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-48 sm:w-64 bg-white border-r border-slate-200 overflow-y-auto shrink-0 hidden md:block">
          <div className="py-4 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-6 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-[#1763B6]/10 text-[#1763B6] border-r-4 border-[#1763B6]' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[500px]">
            
            {/* Mobile Tabs Select */}
            <div className="md:hidden mb-6">
              <select 
                value={activeTab} 
                onChange={e => setActiveTab(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white"
              >
                {TABS.map(tab => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
              </select>
            </div>

            {/* Content Based on Tab */}
            <div className="space-y-6">
              {activeTab === 'basic' && (
                <>
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Course Name</label>
                      <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Short Name / Code</label>
                      <input type="text" name="code" value={formData.code || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Tag (e.g. SAP FICO CORE)</label>
                      <input type="text" name="tag" value={formData.tag || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Category</label>
                    <select name="category" value={formData.category || 'Functional'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none bg-white">
                        <option value="Functional">Functional</option>
                        <option value="Technical">Technical</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Administrative">Administrative</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Status</label>
                      <select name="status" value={formData.status || 'Published'} onChange={(e) => { handleChange(e); setFormData(prev => ({...prev, isUpcoming: e.target.value === 'Upcoming'})); }} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none bg-white">
                        <option value="Live">Live</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Hidden">Hidden</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer pt-6">
                        <input type="checkbox" name="isUpcoming" checked={formData.isUpcoming || false} onChange={handleChange} className="w-4 h-4 rounded text-[#1763B6]" />
                        Mark as Upcoming Course
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Short Description</label>
                      <textarea name="description" rows={3} value={formData.description || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploader
                        label="Course Thumbnail"
                        value={formData.thumbnail || ''}
                        onChange={(url) => setFormData((prev: any) => ({ ...prev, thumbnail: url }))}
                        folder="courses"
                        maxDimension={1200}
                        recommendedSize="1200 × 675 px"
                        recommendedFormat="PNG, JPG, WEBP"
                        previewClassName="w-full h-32 object-cover rounded"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Long Description</label>
                      <textarea name="longDescription" rows={5} value={formData.longDescription || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'info' && (
                <>
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Course Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Duration</label>
                      <input type="text" name="duration" value={formData.duration || ''} onChange={handleChange} placeholder="e.g. 10 Weeks" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Mode</label>
                      <input type="text" name="mode" value={formData.mode || ''} onChange={handleChange} placeholder="e.g. Live Online / Classroom" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Skill Level</label>
                      <select name="level" value={formData.level || 'Beginner'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none bg-white">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                        <option value="Beginner to Advanced">Beginner to Advanced</option>
                        <option value="Programming Background Required">Programming Background Required</option>
                        <option value="IT Background Required">IT Background Required</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Delivery Mode</label>
                      <input type="text" name="deliveryMode" value={formData.deliveryMode || 'Live Virtual'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Rating (1.0 - 5.0)</label>
                      <input type="number" step="0.1" name="rating" value={formData.rating || 0} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Language</label>
                      <input type="text" name="language" value={formData.language || 'English'} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Access / Sandbox Practice</label>
                      <input type="text" name="sandboxPractice" value={formData.sandboxPractice || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    
                    
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Button: Explore Syllabus</label>
                      <input type="text" name="buttonExploreText" value={formData.buttonExploreText || ''} onChange={handleChange} placeholder="e.g. Explore Syllabus" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Button: Register / Inquire</label>
                      <input type="text" name="buttonRegisterText" value={formData.buttonRegisterText || ''} onChange={handleChange} placeholder="e.g. Inquire Now" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" name="buttonRegisterDisabled" checked={formData.buttonRegisterDisabled || false} onChange={handleChange} className="rounded text-[#1763B6]" />
                        Disable Register Button (e.g., for "Coming Soon")
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" name="liveProject" checked={formData.liveProject || false} onChange={handleChange} className="rounded text-[#1763B6]" />
                      Live Project Included
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" name="resumeSupport" checked={formData.resumeSupport || false} onChange={handleChange} className="rounded text-[#1763B6]" />
                      Resume Support
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" name="interviewSupport" checked={formData.interviewSupport || false} onChange={handleChange} className="rounded text-[#1763B6]" />
                      Interview Support
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" name="placementSupport" checked={formData.placementSupport || false} onChange={handleChange} className="rounded text-[#1763B6]" />
                      Placement Support
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" name="sapAccess" checked={formData.sapAccess || false} onChange={handleChange} className="rounded text-[#1763B6]" />
                      SAP Access Included
                    </label>
                  </div>
                </>
              )}

              

              

              {activeTab === 'features' && (
                <>
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Course Features</h3>
                    <button type="button" onClick={() => handleArrayAdd('features', 'New Feature')} className="text-xs font-bold text-[#1763B6] flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Add Feature
                    </button>
                  </div>
                  
                  {(!formData.features || formData.features.length === 0) && (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                      <p className="text-sm text-slate-500 mb-2">No features added yet.</p>
                      <button type="button" onClick={() => handleArrayAdd('features', 'New Feature')} className="text-sm text-[#1763B6] font-bold hover:underline">Add First Feature</button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {(formData.features || []).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-move shrink-0" />
                          <input 
                            type="text" 
                            value={feature} 
                            onChange={(e) => handleArrayChange('features', idx, e.target.value)}
                            className="bg-transparent w-full outline-none text-sm focus:bg-white focus:ring-2 focus:ring-[#1763B6]/20 rounded px-2 py-1"
                            placeholder="e.g. Real-time Server Access"
                          />
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <div className="flex gap-1">
                            <button type="button" onClick={() => handleArrayMove('features', idx, 'up')} className="p-1.5 bg-slate-100 text-slate-500 hover:text-[#1763B6] hover:bg-blue-50 rounded disabled:opacity-30" disabled={idx === 0}><ArrowUp className="w-3 h-3" /></button>
                            <button type="button" onClick={() => handleArrayMove('features', idx, 'down')} className="p-1.5 bg-slate-100 text-slate-500 hover:text-[#1763B6] hover:bg-blue-50 rounded disabled:opacity-30" disabled={idx === (formData.features || []).length - 1}><ArrowDown className="w-3 h-3" /></button>
                            <button type="button" onClick={() => handleArrayRemove('features', idx)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'syllabus' && (
                <>
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Syllabus Topics</h3>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => {
                        const defaultCourse = SAP_COURSES.find(c => c.id === formData.id);
                        if (defaultCourse && defaultCourse.syllabus) {
                          setFormData({ ...formData, syllabus: [...defaultCourse.syllabus] });
                        } else {
                          alert('No default syllabus found for this course.');
                        }
                      }} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                        Reset to Default
                      </button>
                      <button type="button" onClick={() => setFormData({ ...formData, syllabus: [...(formData.syllabus || []), 'New Topic'] })} className="text-xs font-bold text-[#1763B6] flex items-center gap-1 hover:underline">
                        <Plus className="w-3 h-3" /> Add Topic
                      </button>
                    </div>
                  </div>
                  
                  {(!formData.syllabus || formData.syllabus.length === 0) && (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                      <p className="text-sm text-slate-500">No syllabus topics created yet.</p>
                      <button type="button" onClick={() => setFormData({ ...formData, syllabus: ['New Topic'] })} className="mt-2 text-sm text-[#1763B6] font-bold hover:underline">Add First Topic</button>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {(formData.syllabus || []).map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
                        <div className="flex flex-col gap-1 text-slate-400">
                          <button type="button" onClick={() => handleArrayMove('syllabus', idx, 'up')} disabled={idx === 0} className="hover:text-[#1763B6] disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                          <button type="button" onClick={() => handleArrayMove('syllabus', idx, 'down')} disabled={idx === (formData.syllabus || []).length - 1} className="hover:text-[#1763B6] disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                        </div>
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">{idx + 1}</span>
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => {
                            const newSyllabus = [...(formData.syllabus || [])];
                            newSyllabus[idx] = e.target.value;
                            setFormData({ ...formData, syllabus: newSyllabus });
                          }}
                          className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 focus:bg-slate-50 px-2 py-1 rounded"
                          placeholder="Syllabus topic..."
                        />
                        <button type="button" onClick={() => {
                            const newSyllabus = [...(formData.syllabus || [])];
                            newSyllabus.splice(idx, 0, 'New Topic');
                            setFormData({ ...formData, syllabus: newSyllabus });
                        }} className="p-1.5 text-[#1763B6] hover:bg-blue-50 rounded" title="Insert Below">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleArrayRemove('syllabus', idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Remove">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              
              {activeTab === 'mentor' && (
                <>
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Assign Mentor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Mentor Name</label>
                      <input type="text" name="mentorName" value={formData.mentorName || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Designation</label>
                      <input type="text" name="mentorDesignation" value={formData.mentorDesignation || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Experience</label>
                      <input type="text" name="mentorExperience" value={formData.mentorExperience || ''} onChange={handleChange} placeholder="e.g. 15+ Years" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                    <div>
                      <ImageUploader
                        label="Mentor Photo"
                        value={formData.mentorPhoto || ''}
                        onChange={(url) => setFormData((prev: any) => ({ ...prev, mentorPhoto: url }))}
                        folder="mentors"
                        maxDimension={600}
                        recommendedSize="600 × 600 px"
                        recommendedFormat="Square PNG/JPG"
                        previewClassName="w-24 h-24 object-cover rounded-full"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Short Bio</label>
                      <textarea name="mentorBio" rows={4} value={formData.mentorBio || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1763B6]/20 outline-none" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'faq' && (
                <>
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Course FAQs</h3>
                    <button type="button" onClick={() => handleArrayAdd('faqs', { id: Math.random().toString(), question: 'New Question', answer: 'Answer here' })} className="text-xs font-bold text-[#1763B6] flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Add FAQ
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(formData.faqs || []).map((faq: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white border border-slate-200 rounded p-1">
                          <button type="button" onClick={() => handleArrayMove('faqs', idx, 'up')} className="p-1 text-slate-400 hover:text-[#1763B6] disabled:opacity-30" disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => handleArrayMove('faqs', idx, 'down')} className="p-1 text-slate-400 hover:text-[#1763B6] disabled:opacity-30" disabled={idx === (formData.faqs || []).length - 1}><ArrowDown className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => handleArrayRemove('faqs', idx)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="space-y-3 pr-8">
                          <input 
                            type="text" 
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...formData.faqs];
                              newFaqs[idx].question = e.target.value;
                              setFormData({ ...formData, faqs: newFaqs });
                            }}
                            className="w-full font-bold text-slate-800 bg-white px-3 py-2 rounded border border-slate-200 text-sm outline-none"
                            placeholder="Question"
                          />
                          <textarea 
                            value={faq.answer}
                            onChange={(e) => {
                              const newFaqs = [...formData.faqs];
                              newFaqs[idx].answer = e.target.value;
                              setFormData({ ...formData, faqs: newFaqs });
                            }}
                            className="w-full text-slate-600 bg-white px-3 py-2 rounded border border-slate-200 text-sm outline-none"
                            placeholder="Answer"
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                    {(!formData.faqs || formData.faqs.length === 0) && (
                      <p className="text-center text-sm text-slate-500 py-4">No FAQs added.</p>
                    )}
                  </div>
                </>
              )}

              

              
              
              {/* Other tabs like Gallery, Reviews are left minimal as they require more complex file uploads or cross-referencing for MVP */}
              {(activeTab === 'gallery' || activeTab === 'reviews') && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-500 font-medium">This module ({activeTab}) is being provisioned.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
