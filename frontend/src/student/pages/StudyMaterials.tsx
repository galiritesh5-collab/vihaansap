import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { FileText, Download, ExternalLink, Calendar } from 'lucide-react';
import { downloadFile } from '../../utils/downloadFile';
import { useActiveBatch } from '../contexts/ActiveBatchContext';
import { isTargetedToStudent } from '../../utils/recipientTargeting';

export default function StudyMaterials() {
  const { studentProfile } = useAuth();
  const db = useDB();

  const { activeBatch } = useActiveBatch();
  const studyMaterials = db.studyMaterials?.filter(m => 
    m.batchId === activeBatch?.id && m.visibility !== 'Hidden' && isTargetedToStudent(m, studentProfile)
  ).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()) || [];

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Study Materials</h2>
        <p className="text-slate-500 text-sm mt-1">Access notes, presentations, and resources for your batches.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {studyMaterials.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            {activeBatch ? 'No study materials have been uploaded for this batch yet.' : 'No active batch assigned yet.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {studyMaterials.map(mat => {
              const batch = db.batches.find(b => b.id === mat.batchId);
              return (
              <div key={mat.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-[#1763B6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{mat.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {mat.type}
                      </span>
                      <span className="text-xs text-slate-500">{batch?.course}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {mat.uploadDate}
                      </span>
                    </div>
                  </div>
                </div>
                  {mat.type === 'Link' ? (
                    <a 
                      href={mat.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#1763B6] text-slate-700 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Link
                    </a>
                  ) : (
                    <button
                      onClick={() => downloadFile(mat.url, mat.fileName || mat.title)}
                      className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#1763B6] text-slate-700 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
