type SelectableStudent = {
  id: string;
  uid?: string; // Firebase Auth UID — MUST be used for Firestore rule checks
  name?: string;
  email?: string;
};

interface StudentRecipientSelectorProps {
  students: SelectableStudent[];
  selectedIds: string[];
  onChange: (studentIds: string[]) => void;
  emptyMessage?: string;
}

/**
 * Returns the primary ID to store in recipientIds for Firestore.
 * MUST be the Firebase Auth UID (student.uid) so that Firestore rules can verify
 * `request.auth.uid in resource.data.recipientIds`.
 * Falls back to student.id only if uid is not yet populated (legacy records).
 */
function primaryRecipientId(student: SelectableStudent): string {
  return student.uid || student.id;
}

/** Returns all IDs for a student (uid + id) to support checking existing selectedIds. */
function allStudentIds(student: SelectableStudent): string[] {
  return [student.uid, student.id].filter(Boolean) as string[];
}

/** Shared explicit-recipient picker. "All Students" remains controlled by the parent form. */
export default function StudentRecipientSelector({
  students,
  selectedIds,
  onChange,
  emptyMessage = 'No students enrolled.',
}: StudentRecipientSelectorProps) {
  const selectedIdSet = new Set(selectedIds);
  const selectedCount = students.filter(s => allStudentIds(s).some(id => selectedIdSet.has(id))).length;
  const allSelected = students.length > 0 && selectedCount === students.length;

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      // Store ONLY the Firebase Auth UID (primaryRecipientId) per student.
      // This ensures Firestore rules can verify request.auth.uid in resource.data.recipientIds.
      const primaryIds = students.map(s => primaryRecipientId(s));
      onChange(Array.from(new Set(primaryIds)));
    }
  };

  const toggleStudent = (student: SelectableStudent) => {
    const isCurrentlySelected = allStudentIds(student).some(id => selectedIdSet.has(id));
    const nextIds = new Set(selectedIds);
    if (isCurrentlySelected) {
      // Remove all known IDs for this student to clean up any legacy id/uid mixtures
      allStudentIds(student).forEach(id => nextIds.delete(id));
    } else {
      // Add ONLY the Firebase Auth UID (primaryRecipientId) so Firestore rule check works
      nextIds.add(primaryRecipientId(student));
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
