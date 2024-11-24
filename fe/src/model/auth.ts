export interface UserInfo {
  _id: string;
  name: string;
  studentId: string;
  gen: number;
  major: string;
  account: Account;
  group: string;
  role?: string;
  classId: string;
}
export interface Account {
  id: string;
  _id: string;
  email: string;
  profilePicture: string;
}
