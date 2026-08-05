content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()

# Find the right place to insert thumbnail uploader - after video URL field, before recipients
OLD = '''            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link / Video URL</label>
              <input required type="text" value={editing.videoUrl || ''} onChange={e => setEditing({...editing, videoUrl: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipients</label>'''

NEW = '''            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link / Video URL</label>
              <input required type="text" value={editing.videoUrl || ''} onChange={e => setEditing({...editing, videoUrl: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <ImageUploader
                label="Recording Thumbnail (optional)"
                value={editing.thumbnail || ''}
                onChange={(url) => setEditing({...editing, thumbnail: url})}
                folder="recordings"
                maxDimension={1200}
                recommendedSize="1200 \u00d7 675 px"
                recommendedFormat="PNG, JPG, WEBP"
                previewClassName="w-full h-28 object-cover rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipients</label>'''

if OLD in content:
    content = content.replace(OLD, NEW)
    open('frontend/src/admin/pages/BatchDashboard.tsx', 'w', encoding='utf-8').write(content)
    print('Done - ImageUploader injected into recording form')
else:
    print('PATTERN NOT FOUND')
    # show what we have
    idx = content.find('Link / Video URL')
    print(repr(content[max(0,idx-20):idx+300]))
