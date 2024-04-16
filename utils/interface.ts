export type TeacherProps = {
  nationalIdNumber: string;
  title: string;
  name: string;
  surname: string;
  dob: string;
  teacherNumber: string;
  salary: string;
  [key: string]: string | number;
};

export interface TeacherPropsWithId extends TeacherProps {
  id: number;
}

export type ChildrenProps = {
  children: React.ReactNode;
};

export type AdminProps = {
  nationalIdNumber: string;
  name: string;
  surname: string;
  dob: string;
  studentNumber: string;
};

export interface AdminPropsWithId extends AdminProps {
  id: number;
}

export interface HeaderProps {
  userType: string | null;
  uid: string | undefined;
}

export type StudentProps = {
  nationalIdNumber: string;
  name: string;
  surname: string;
  dob: string;
  studentNumber: string;
};

export interface StudentPropsWithId extends StudentProps {
  id: number;
}

export interface IIProps {
  loading: boolean;
  isSidebarOpen: boolean;
  teacherData: Array<TeacherProps>;
  studentData: Array<StudentProps>;
  adminData: Array<AdminProps>;
  searchTerm: string;
}

export interface UserDetails {
  uid: string;
  userType: string;
  name: string;
}

export interface Classroom {
  uid: string;
  teacher: string;
  subject: string;
  students: string[]; 
  assignments: []
}

export interface Assignment {
  assignmentId: string;
  title: string;
  dueDate: string;
  description?: string;
  file?: string;
}

export interface Submission {
  uid: string;
  studentId: string | undefined | null;
  assignmentId: string;
  file: string | undefined | null;
  hasBeenGraded: boolean;
  mark: Number | undefined;
  markedFile:string | undefined | null; 
}