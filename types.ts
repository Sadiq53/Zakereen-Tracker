export interface Member {
  id: string;
  firstName: string;
  surname: string;
  itsNumber: string; // Unique ID
  houseColor: 'Red' | 'Blue' | 'Green' | 'Yellow' | string;
  address: string;
  mobileNumber: string;
  grade: string;
  classDivision: string;
  photoUrl?: string;
  isActive: boolean;
  createdAt: number;
}

export interface Session {
  id: string;
  name: string;
  location: string;
  date: string; // ISO Date string YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  notes?: string;
  createdAt: number;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE', // Optional extension
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  memberId: string;
  status: AttendanceStatus;
  timestamp: number;
}

// Analytics Types
export interface SessionStats {
  sessionId: string;
  totalMembers: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
}

export interface MemberStats {
  totalSessions: number;
  attendedSessions: number;
  attendanceRate: number;
}
