/** Backward-compatible recipient targeting for batch content. */
export type RecipientTarget = {
  recipientType?: 'all' | 'selected';
  recipientMode?: 'all' | 'selected'; // legacy field
  recipientIds?: string[];
  visibilitySettings?: { mode?: string; studentIds?: string[] };
};

export const studentIdentifiers = (student: any) =>
  [student?.id, student?.uid, student?.studentId].filter(Boolean) as string[];

export const isTargetedToStudent = (item: RecipientTarget, student: any) => {
  const recipientType = item.recipientType || item.recipientMode;
  if (recipientType === 'selected') {
    const recipients = item.recipientIds || item.visibilitySettings?.studentIds || [];
    return studentIdentifiers(student).some(id => recipients.includes(id));
  }
  if (item.visibilitySettings?.mode === 'Selected') {
    return studentIdentifiers(student).some(id => (item.visibilitySettings?.studentIds || []).includes(id));
  }
  return true; // legacy documents remain visible to their batch
};

export const enrolledStudentsForBatch = (batch: any, students: any[]) =>
  (students || []).filter(student =>
    studentIdentifiers(student).some(id => (batch?.studentIds || []).includes(id)) || student.batch === batch?.name
  );
