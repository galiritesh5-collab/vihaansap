content = open('frontend/src/admin/pages/BatchDashboard.tsx', encoding='utf-8').read()
idx = content.find("activeTab === 'reviews'")
print(repr(content[idx:idx+2500]))
