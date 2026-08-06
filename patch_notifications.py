filepath = 'frontend/src/student/pages/Notifications.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_jsx = """                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-slate-800">{notif.title}</h3>
                    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{notif.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>"""

new_jsx = """                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-slate-800">{notif.title}</h3>
                    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{notif.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  
                  {notif.type === 'review_campaign' && (
                    <div className="mt-3">
                      <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                        Check your Dashboard to submit this review
                      </span>
                    </div>
                  )}
                </div>
              </div>"""

if old_jsx in content:
    content = content.replace(old_jsx, new_jsx)
    print("Patched Notifications.tsx")
else:
    print("WARNING: Could not find JSX block in Notifications.tsx")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
