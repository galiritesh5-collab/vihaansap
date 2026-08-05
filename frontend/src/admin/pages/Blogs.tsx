import React, { useState, useEffect } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { Plus, Edit2, Trash2, X, CheckCircle } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';

const CATEGORIES = [
  'Technical', 'Career', 'SAP FICO', 'SAP MM', 'SAP SD', 'ABAP', 'SAP HANA', 'General'
];

export default function Blogs() {
  const db = useDB();
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [tagInput, setTagInput] = useState('');

  

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedSlug = editingBlog.title ? editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
    const blogToSave = { ...editingBlog, slug: generatedSlug };
    
    if (editingBlog.id) {
      MockDB.updateItem('blogs', editingBlog.id, blogToSave);
    } else {
      MockDB.addItem('blogs', { ...blogToSave, date: new Date().toISOString().split('T')[0] });
    }
    setEditingBlog(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      MockDB.deleteItem('blogs', id);
    }
  };

  const handleCoverImageChange = (url: string) => {
    setEditingBlog({ ...editingBlog, coverImage: url });
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!editingBlog.tags?.includes(tagInput.trim())) {
        setEditingBlog({
          ...editingBlog,
          tags: [...(editingBlog.tags || []), tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditingBlog({
      ...editingBlog,
      tags: editingBlog.tags.filter((t: string) => t !== tagToRemove)
    });
  };

  const toggleCategory = (category: string) => {
    const currentCategories = editingBlog.categories || [];
    if (currentCategories.includes(category)) {
      setEditingBlog({
        ...editingBlog,
        categories: currentCategories.filter((c: string) => c !== category)
      });
    } else {
      setEditingBlog({
        ...editingBlog,
        categories: [...currentCategories, category]
      });
    }
  };

  // Calculate reading time based on content (rough estimate: 200 words per min)
  useEffect(() => {
    if (editingBlog?.content) {
      const text = editingBlog.content.replace(/<[^>]+>/g, '');
      const words = text.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      setEditingBlog((prev: any) => ({ ...prev, readingTime: `${minutes} min read` }));
    }
  }, [editingBlog?.content]);

  // Auto-save logic (Mock for future implementation)
  useEffect(() => {
    if (editingBlog) {
      const timer = setTimeout(() => {
        // Auto-save logic here
        console.log("Auto-saved draft");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [editingBlog]);

  if (editingBlog) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingBlog(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-slate-800">{editingBlog.id ? 'Edit Post' : 'New Post'}</h2>
              <p className="text-xs text-slate-500">Auto-saved just now</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">
              Save Draft
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Publish
            </button>
          </div>
        </div>

        {/* Main Content: Split Screen */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Editor & Settings */}
          <div className="w-1/2 h-full overflow-y-auto border-r border-slate-200 bg-white">
            <div className="p-8 max-w-3xl mx-auto space-y-8">
              {/* Core Details */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Post Title"
                  value={editingBlog.title || ''}
                  onChange={e => setEditingBlog({...editingBlog, title: e.target.value})}
                  className="w-full text-4xl font-display font-bold text-slate-800 placeholder-slate-300 border-none focus:outline-none focus:ring-0 px-0"
                />
                
                {/* Cover Image Upload */}
                <div className="mt-4">
                  <ImageUploader
                    label="Cover Image"
                    value={editingBlog.coverImage || ''}
                    onChange={handleCoverImageChange}
                    folder="blogs"
                    maxDimension={1200}
                    recommendedSize="1200 × 630 px"
                    recommendedFormat="PNG, JPG, WEBP"
                    previewClassName="w-full h-48 object-cover"
                  />
                </div>
              </div>

              {/* Rich Text Editor Component */}
              <div className="min-h-[500px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
                <RichTextEditor 
                  content={editingBlog.content || ''} 
                  onChange={(content) => setEditingBlog({...editingBlog, content})} 
                />
              </div>

              <hr className="border-slate-100 my-8" />

              {/* Settings Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800">Post Settings</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
                  <p className="text-xs text-slate-500 mb-2">Maximum 200 characters. Displayed on blog listing pages.</p>
                  <textarea 
                    maxLength={200}
                    rows={3}
                    value={editingBlog.shortDescription || ''}
                    onChange={e => setEditingBlog({...editingBlog, shortDescription: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="text-right text-xs text-slate-400 mt-1">
                    {(editingBlog.shortDescription || '').length}/200
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Author</label>
                  <input 
                    type="text" 
                    value={editingBlog.author || ''}
                    onChange={e => setEditingBlog({...editingBlog, author: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select 
                      value={editingBlog.status || 'Draft'}
                      onChange={e => setEditingBlog({...editingBlog, status: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <input 
                      type="checkbox" 
                      id="featured"
                      checked={editingBlog.featured || false}
                      onChange={e => setEditingBlog({...editingBlog, featured: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="featured" className="text-sm font-semibold text-slate-700 cursor-pointer">
                      Featured Post
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Image Position</label>
                  <p className="text-xs text-slate-500 mb-2">Controls how the image is cropped on blog cards.</p>
                  <select 
                    value={editingBlog.imagePosition || 'Center'}
                    onChange={e => setEditingBlog({...editingBlog, imagePosition: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Center">Center</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          (editingBlog.categories || []).includes(category) 
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
                  <div className="p-2 border border-slate-200 rounded-lg bg-white flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500">
                    {(editingBlog.tags || []).map((tag: string) => (
                      <span key={tag} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-sm font-medium">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500 focus:outline-none">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder={editingBlog.tags?.length ? "Add another tag..." : "Type and press Enter to add tags"}
                      className="flex-1 min-w-[150px] outline-none border-none focus:ring-0 text-sm p-1"
                    />
                  </div>
                </div>

                              </div>
            </div>
          </div>
          
          {/* Right Column: Live Preview */}
          <div className="w-1/2 h-full overflow-y-auto bg-slate-50 border-l border-slate-200 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Preview</h3>
                <span className="text-xs text-slate-500">{editingBlog.readingTime || '1 min read'}</span>
              </div>
              
              <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {editingBlog.coverImage ? (
                  <img src={editingBlog.coverImage} alt="Cover" className="w-full h-auto" />
                ) : (
                  <div className="w-full h-64 bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-400 font-medium">No cover image</span>
                  </div>
                )}
                
                <div className="p-8 md:p-12">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(editingBlog.categories || []).map((cat: string) => (
                      <span key={cat} className="px-3 py-1 bg-[#1763B6]/10 text-[#1763B6] rounded-full text-xs font-bold uppercase tracking-wider">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4 leading-tight">
                    {editingBlog.title || 'Untitled Post'}
                  </h1>

                  {editingBlog.shortDescription && (
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                      {editingBlog.shortDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                      {(editingBlog.author || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{editingBlog.author || 'Author Name'}</div>
                      <div className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>

                  {/* Prose Content Render */}
                  <div 
                    className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-a:text-indigo-600 hover:prose-a:text-indigo-700"
                    dangerouslySetInnerHTML={{ __html: editingBlog.content || '<p class="text-slate-400 italic">Start writing to see preview...</p>' }}
                  />

                  {/* Tags */}
                  {(editingBlog.tags || []).length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {editingBlog.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Blogs CMS</h2>
          <p className="text-slate-500 text-sm mt-1">Manage public blog posts.</p>
        </div>
        <button 
          onClick={() => setEditingBlog({ title: '', author: '', status: 'Draft', content: '', imagePosition: 'Center' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Write Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Post Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.blogs.map(blog => (
              <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800 mb-1">{blog.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{blog.shortDescription || 'No description provided.'}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                      {(blog.author || 'A')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{blog.author}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    blog.status === 'Published' ? 'bg-green-50 text-green-700 border border-green-200/50' : 
                    blog.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                    'bg-slate-100 text-slate-600 border border-slate-200/50'
                  }`}>
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{blog.date}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setEditingBlog(blog)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors" title="Edit Post">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete Post">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {db.blogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No blogs found. Click "Write Post" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
