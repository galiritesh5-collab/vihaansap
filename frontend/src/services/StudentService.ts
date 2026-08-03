import { FirestoreStudentService } from './FirestoreStudentService';

export class StudentService {
  static async getStudentByUid(uid: string) {
    return await FirestoreStudentService.getStudent(uid);
  }

  static async saveStudentProfile(profileData: any) {
    const dataWithFlag = {
      ...profileData,
      profileCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    if (profileData.uid) {
      await FirestoreStudentService.upsertStudent(profileData.uid, dataWithFlag);
    }
  }
}
