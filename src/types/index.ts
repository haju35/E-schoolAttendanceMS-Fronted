export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'family';
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  admission_number: string;
  roll_number: string;
  date_of_birth: string;
  gender: string;
  current_class_id: number;
  current_section_id: number;
  admission_date: string;
  status: string;
  user?: User;
  currentClass?: Class;
  currentSection?: Section;
}

export interface Teacher {
  id: number;
  user_id: number;
  qualification: string;
  joining_date: string;
  user?: User;
}

export interface Family {
  id: number;
  user_id: number;
  occupation: string;
  emergency_contact: string;
  user?: User;
  students?: Student[];
}

export interface Class {
  id: number;
  name: string;
  numeric_value: number;
}

export interface Section {
  id: number;
  class_room_id: number;
  name: string;
  capacity: number;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface AcademicYear {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Term {
  id: number;
  name: string;
  academic_year_id: number;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface TeacherAssignment {
  id: number;
  teacher_id: number;
  subject_id: number;
  class_id: number;
  section_id: number;
  academic_year: string;
}

// Add to your types file
export interface ClassTeacher {
  id: number;
  teacher_id: number;
  class_room_id: number;
  section_id: number;
  academic_year: string;
  teacher?: Teacher;
  teacher_name?: string; // From API response
  teacher_email?: string; // From API response
  class_name?: string; // From API response
  section_name?: string; // From API response
  students_count?: number;
}

export interface ClassTeacherFormData {
  teacher_id: number;
  class_room_id: number;
  section_id: number;
  academic_year: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  class_id: number;
  section_id: number;
  subject_id: number;
  teacher_id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  access_token: string;
  token_type: string;
  role: string;
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  password_confirmation: string
}