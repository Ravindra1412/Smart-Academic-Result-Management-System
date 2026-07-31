import { useReducer, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import { Storage } from '../utils/helpers';
import { SK, PASS_MARK_DEFAULT } from '../utils/constants';
import { DEFAULT_STUDENTS } from '../utils/defaultStudents';

const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':       return { ...state, page: action.page };
    case 'SET_STUDENTS':   return { ...state, students: action.students };
    case 'ADD_STUDENT':    return { ...state, students: [...state.students, action.student] };
    case 'UPDATE_STUDENT': return { ...state, students: state.students.map(s => s.id === action.student.id ? action.student : s) };
    case 'DELETE_STUDENT': return { ...state, students: state.students.filter(s => s.id !== action.id) };
    case 'SET_CURRENT_STU': return { ...state, currentStudent: action.student };
    case 'SET_SETTINGS':   return { ...state, ...action.settings };
    case 'SET_THEME':      return { ...state, theme: action.theme };
    case 'INC_NEXT_ID':    return { ...state, nextId: state.nextId + 1 };
    default:               return state;
  }
}

function AppProvider({ children }) {
  const initialStudents = Storage.load(SK.students) || DEFAULT_STUDENTS.map(s => ({ ...s, att: s.att.map(m => [...m]) }));
  const settings = Storage.load(SK.settings) || {};
  const [state, dispatch] = useReducer(appReducer, {
    page: 'landing',
    students: initialStudents,
    nextId: Storage.load(SK.nextId) || 8,
    currentStudent: null,
    passMark: settings.passMark || PASS_MARK_DEFAULT,
    schoolName: settings.schoolName || 'Government Higher Secondary School',
    academicYear: settings.academicYear || '2024–2025',
    adminPassword: Storage.load(SK.adminPw) || 'Admin@2024',
    theme: Storage.load(SK.theme) || 'dark',
  });

  // Persist on every students change
  useEffect(() => {
    Storage.save(SK.students, state.students);
    Storage.save(SK.nextId, state.nextId);
  }, [state.students, state.nextId]);

  useEffect(() => {
    document.body.className = state.theme === 'light' ? 'light' : '';
  }, [state.theme]);

  const saveStudents = useCallback(() => {
    Storage.save(SK.students, state.students);
  }, [state.students]);

  const goTo = useCallback((page) => dispatch({ type: 'SET_PAGE', page }), []);
  const toggleTheme = useCallback(() => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: 'SET_THEME', theme: next });
    Storage.save(SK.theme, next);
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch, goTo, toggleTheme, saveStudents }), [state, dispatch, goTo, toggleTheme, saveStudents]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
const useApp = () => useContext(AppContext);

export { AppContext, AppProvider, useApp };
