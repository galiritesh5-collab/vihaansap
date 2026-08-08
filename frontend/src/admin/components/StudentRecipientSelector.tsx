type SelectableStudent = {
  id: string;
  uid?: string;
  name?: string;
  email?: string;
};

interface StudentRecipientSelectorProps {
  students: SelectableStudent[];
  selectedIds: string[];
  onChange: (studentIds: string[]) => void;
  emptyMessage?: string;
}

/** Shared explicit-recipient picker. "All Students" remains controlled by the parent form. */
export default function StudentRecipientSelector({
  students,
  selectedIds,
  onChange,
  emptyMessage = 'No students enrolled.',
}: StudentRecipientSelectorProps) {
  const studentPrimaryIds = Array.from(new Set(students.map(student => student.id)));
  const selectedIdSet = new Set(selectedIds);
  const selectedCount = studentPrimaryIds.filter(id => {
    const student = students.find(s => s.id === id);
    const ids = [student?.id, student?.uid].filter(Boolean) as string[];
    return ids.some(i => selectedIdSet.has(i));
  }).length;
  const allSelected = studentPrimaryIds.length > 0 && selectedCount === studentPrimaryIds.length;

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      const allIds = students.flatMap(s => [s.id, s.uid].filter(Boolean) as string[]);
      onChange(Array.from(new Set(allIds)));
    }
  };

  const toggleStudent = (student: SelectableStudent) => {
    const ids = [student.id, student.uid].filter(Boolean) as string[];
    const isCurrentlySelected = ids.some(id => selectedIdSet.has(id));
    const nextIds = new Set(selectedIds);
    if (isCurrentlySelected) {
      ids.forEach(id => nextIds.delete(id));
    } else {
      ids.forEach(id => nextIds.add(id));
    }
    onChange(Array.from(nextIds));
  };

  return (
    <div className="mt-3 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-white">
      <label htmlFor="select-all" className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 border-b border-slate-100 pb-2">
        <input
          id="select-all"
          type="checkbox"
          checked={allSelected}
          disabled={students.length === 0}
          onChange={toggleAll}
        />
        Select All
      </label>
      {students.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      ) : (
        students.map(student => {
          const ids = [student.id, student.uid].filter(Boolean) as string[];
          const isChecked = ids.some(id => selectedIdSet.has(id));
          return (
            <label key={student.id} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input type="checkbox" checked={isChecked} onChange={() => toggleStudent(student)} />
              {student.name || student.email || 'Unnamed student'}
              {student.name && student.email && <span className="text-slate-400 text-xs">({student.email})</span>}
            </label>
          );
        })
      )}
      <p className="text-xs text-slate-500 pt-1">Selected: {selectedCount} {selectedCount === 1 ? 'student' : 'students'}</p>
    </div>
  );
}
