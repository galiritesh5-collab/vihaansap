import re

with open('frontend/src/admin/pages/DoubtSupport.tsx', 'r') as f:
    content = f.read()

# Add fixedBatchId prop
content = content.replace("export default function DoubtSupport() {", "export default function DoubtSupport({ fixedBatchId }: { fixedBatchId?: string } = {}) {")

# Update batchFilter state
content = content.replace("const [batchFilter, setBatchFilter] = useState('All');", "const [batchFilter, setBatchFilter] = useState(fixedBatchId || 'All');")

# Hide or disable batch filter dropdown if fixedBatchId exists
select_pattern = r"<select\s+value=\{batchFilter\}\s+onChange=\{\(e\) => setBatchFilter\(e\.target\.value\)\}.*?</select>"
new_select = """{!fixedBatchId && (
            <select 
              value={batchFilter} 
              onChange={(e) => setBatchFilter(e.target.value)} 
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Batches</option>
              {uniqueBatches.map(b => (
                <option key={b as string} value={b as string}>Batch {db.batches?.find(batch => batch.id === b)?.name || b}</option>
              ))}
            </select>
          )}"""
content = re.sub(select_pattern, new_select, content, flags=re.DOTALL)

with open('frontend/src/admin/pages/DoubtSupport.tsx', 'w') as f:
    f.write(content)

with open('frontend/src/admin/pages/BatchDashboard.tsx', 'r') as f:
    bd_content = f.read()

# Replace DoubtSupportTab entirely with a wrapper around the actual DoubtSupport
if 'import DoubtSupport from' not in bd_content:
    bd_content = bd_content.replace("import { MockDB } from '../../services/MockDB';", "import { MockDB } from '../../services/MockDB';\nimport DoubtSupport from './DoubtSupport';")

tab_pattern = r"function DoubtSupportTab\(\{ batchId \}: \{ batchId: string \}\) \{.*?\n\}\n"
new_tab = """function DoubtSupportTab({ batchId }: { batchId: string }) {
  return (
    <div className="-m-6">
      <DoubtSupport fixedBatchId={batchId} />
    </div>
  );
}
"""
bd_content = re.sub(tab_pattern, new_tab, bd_content, flags=re.DOTALL)

with open('frontend/src/admin/pages/BatchDashboard.tsx', 'w') as f:
    f.write(bd_content)
