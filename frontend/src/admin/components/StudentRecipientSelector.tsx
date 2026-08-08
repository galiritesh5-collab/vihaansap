type SelectableStudent = {
  id: string;
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
  const studentIds = Array.from(new Set(students.map(student => student.id)));
  const availableIds = new Set(studentIds);
  const selectedIdSet = new Set(selectedIds);
  const selectedCount = studentIds.filter(id => selectedIdSet.has(id)).length;
  const allSelected = studentIds.length > 0 && selectedCount === studentIds.length;

  const toggleAll = () => {
    onChange(allSelected ? [] : studentIds);
  };

  const toggleStudent = (studentId: string) => {
    const nextIds = new Set(selectedIds);
    if (nextIds.has(studentId)) {
      nextIds.delete(studentId);
    } else if (availableIds.has(studentId)) {
      nextIds.add(studentId);
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
          disabled={studentIds.length === 0}
          onChange={toggleAll}
        />
        Select All
      </label>
      {studentIds.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      ) : (
        students.map(student => (
          <label key={student.id} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
            <input type="checkbox" checked={selectedIdSet.has(student.id)} onChange={() => toggleStudent(student.id)} />
            {student.name || student.email || 'Unnamed student'}
            {student.name && student.email && <span className="text-slate-400 text-xs">({student.email})</span>}
          </label>
        ))
      )}
      <p className="text-xs text-slate-500 pt-1">Selected: {selectedCount} {selectedCount === 1 ? 'student' : 'students'}</p>
    </div>
  );
}
