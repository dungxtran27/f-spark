export interface UserInfo {
  _id: string;
  name: string;
  studentId: string;
  gen: number;
  major: string;
  account: Account;
  group: any;
  role?: string;
  classId: string;
}
export interface Account {
  id: string;
  _id: string;
  email: string;
  profilePicture: string;
}

export interface Deadline {
  deadLineFor: any;
  _id?: string;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  priorDeadline?: string | null;
  type: string;
}

export interface Term {
  _id?: string;
  termCode: string;
  startTime: Date;
  endTime: Date;
  timeLine: Deadline[];
  createdAt?: Date;
  updatedAt?: Date;
}
