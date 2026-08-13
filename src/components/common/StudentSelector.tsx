import React from 'react';
import { ChevronDown, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StudentSelectorProps {
  className?: string;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({ className = '' }) => {
  const { students, selectedStudentId, selectStudent } = useApp();

  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm ${className}`}>
      <User className="h-3.5 w-3.5 text-blue-600 shrink-0" />
      <span className="font-bold uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">Select Student</span>
      <div className="relative">
        <select
          value={selectedStudentId}
          onChange={(event) => selectStudent(event.target.value)}
          className="appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-2.5 pr-7 py-1.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 min-w-[160px]"
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
};
