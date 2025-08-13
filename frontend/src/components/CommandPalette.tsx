import React, { useMemo, useState } from 'react';
import * as Command from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, Keyboard, Moon, Sun, BookOpen, Bell, User, Trophy, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const actions = useMemo(() => ([
    { icon: <BookOpen className="w-4 h-4" />, label: 'Go to Dashboard', run: () => navigate('/dashboard') },
    { icon: <BookOpen className="w-4 h-4" />, label: 'Browse Classes', run: () => navigate('/classes') },
    { icon: <BookOpen className="w-4 h-4" />, label: 'Upcoming Exams', run: () => navigate('/upcoming-exams') },
    { icon: <Trophy className="w-4 h-4" />, label: 'Achievements', run: () => navigate('/achievements') },
    { icon: <Bell className="w-4 h-4" />, label: 'Notifications', run: () => navigate('/notifications') },
    { icon: <User className="w-4 h-4" />, label: 'Profile', run: () => navigate('/profile') },
    { icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', run: () => toggleTheme() },
    { icon: <Settings className="w-4 h-4" />, label: 'Study Tools', run: () => navigate('/study-tools') },
  ]), [navigate, isDark, toggleTheme]);

  const filtered = useMemo(() => actions.filter(a => a.label.toLowerCase().includes(search.toLowerCase())), [actions, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <Command.Command value={search} onValueChange={setSearch} label="Global Command Palette">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <Search className="w-4 h-4 text-white/70" />
            <Command.CommandInput placeholder="Search actions…" className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50" />
            <div className="hidden md:flex items-center gap-1 text-[11px] text-white/60">
              <Keyboard className="w-4 h-4" />
              <span>Ctrl</span>
              <span>+</span>
              <span>K</span>
            </div>
          </div>
          <Command.CommandList className="max-h-[50vh] overflow-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-white/60">No results</div>
            )}
            <Command.CommandGroup heading="Navigation" className="text-white/60">
              {filtered.map((a) => (
                <Command.CommandItem key={a.label} onSelect={() => { a.run(); onClose(); }} className="px-4 py-3 text-sm text-white flex items-center gap-3 cursor-pointer hover:bg-white/5">
                  {a.icon}
                  <span>{a.label}</span>
                </Command.CommandItem>
              ))}
            </Command.CommandGroup>
          </Command.CommandList>
        </Command.Command>
      </div>
    </div>
  );
};

export default CommandPalette;


