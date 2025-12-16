import { Member, Session, AttendanceRecord } from '../types';

const STORAGE_KEYS = {
  MEMBERS: 'mt_members',
  SESSIONS: 'mt_sessions',
  ATTENDANCE: 'mt_attendance',
  AUTH: 'mt_auth',
};

// Generic storage helpers
const get = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading from storage', e);
    return [];
  }
};

const set = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing to storage', e);
  }
};

// Members
export const getMembers = (): Member[] => get<Member>(STORAGE_KEYS.MEMBERS);
export const saveMember = (member: Member): void => {
  const members = getMembers();
  const index = members.findIndex((m) => m.id === member.id);
  if (index >= 0) {
    members[index] = member;
  } else {
    members.unshift(member); // Add to top
  }
  set(STORAGE_KEYS.MEMBERS, members);
};
export const deleteMember = (id: string): void => {
  // 1. Delete the member
  const currentMembers = getMembers();
  const updatedMembers = currentMembers.filter((m) => m.id !== id);
  set(STORAGE_KEYS.MEMBERS, updatedMembers);

  // 2. Cascade delete: Remove all attendance records for this member
  const allAttendance = getAttendance();
  const cleanAttendance = allAttendance.filter(a => a.memberId !== id);
  set(STORAGE_KEYS.ATTENDANCE, cleanAttendance);
};

// Sessions
export const getSessions = (): Session[] => get<Session>(STORAGE_KEYS.SESSIONS);
export const saveSession = (session: Session): void => {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  set(STORAGE_KEYS.SESSIONS, sessions);
};
export const deleteSession = (id: string): void => {
  // 1. Delete the session
  const currentSessions = getSessions();
  const updatedSessions = currentSessions.filter((s) => s.id !== id);
  set(STORAGE_KEYS.SESSIONS, updatedSessions);

  // 2. Cascade delete: Remove all attendance records for this session
  const allAttendance = getAttendance();
  const filteredAttendance = allAttendance.filter((a) => a.sessionId !== id);
  set(STORAGE_KEYS.ATTENDANCE, filteredAttendance);
};

// Attendance
export const getAttendance = (): AttendanceRecord[] => get<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE);
export const getSessionAttendance = (sessionId: string): AttendanceRecord[] => {
  return getAttendance().filter((a) => a.sessionId === sessionId);
};
export const saveAttendance = (record: AttendanceRecord): void => {
  const all = getAttendance();
  const index = all.findIndex((a) => a.sessionId === record.sessionId && a.memberId === record.memberId);
  
  if (index >= 0) {
    all[index] = record;
  } else {
    all.push(record);
  }
  set(STORAGE_KEYS.ATTENDANCE, all);
};

// Auth (Simple Simulation)
export const checkAuth = (): boolean => localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
export const login = (password: string): boolean => {
  if (password === 'admin123') {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    return true;
  }
  return false;
};
export const logout = (): void => localStorage.removeItem(STORAGE_KEYS.AUTH);

// Initial Seed Data (if empty)
export const seedData = () => {
  if (getMembers().length === 0) {
    const mockMembers: Member[] = [
      { id: '1', firstName: 'Ali', surname: 'Hussain', itsNumber: '20304050', houseColor: 'Blue', address: '123 Main St', mobileNumber: '555-0101', grade: 'A', classDivision: '1', isActive: true, createdAt: Date.now() },
      { id: '2', firstName: 'Fatema', surname: 'Zahra', itsNumber: '20304051', houseColor: 'Green', address: '456 Oak Ln', mobileNumber: '555-0102', grade: 'B', classDivision: '2', isActive: true, createdAt: Date.now() },
      { id: '3', firstName: 'Hasan', surname: 'Rizvi', itsNumber: '20304052', houseColor: 'Red', address: '789 Pine Ave', mobileNumber: '555-0103', grade: 'A', classDivision: '1', isActive: true, createdAt: Date.now() },
      { id: '4', firstName: 'Zainab', surname: 'Abbas', itsNumber: '20304053', houseColor: 'Yellow', address: '321 Elm St', mobileNumber: '555-0104', grade: 'C', classDivision: '3', isActive: false, createdAt: Date.now() },
    ];
    set(STORAGE_KEYS.MEMBERS, mockMembers);
  }
};