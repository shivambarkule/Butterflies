import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, FileText, Video, Search } from 'lucide-react';

const mockMaterials = [
  { id: 1, type: 'pdf', title: 'Calculus Notes', desc: 'Comprehensive notes for Calculus.', link: '#', category: 'Mathematics' },
  { id: 2, type: 'video', title: 'Physics: Motion', desc: 'Video lecture on motion.', link: '#', category: 'Physics' },
  { id: 3, type: 'link', title: 'English Literature Guide', desc: 'External resource for literature.', link: '#', category: 'English' },
  { id: 4, type: 'pdf', title: 'Organic Chemistry', desc: 'PDF notes for organic chemistry.', link: '#', category: 'Chemistry' },
];

const categories = ['All', 'Mathematics', 'Physics', 'English', 'Chemistry'];

const icons = {
  pdf: <FileText className="w-6 h-6 text-purple-400" />,
  video: <Video className="w-6 h-6 text-pink-400" />,
  link: <BookOpen className="w-6 h-6 text-blue-400" />,
};

const StudyMaterialsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockMaterials.filter(m =>
    (selectedCategory === 'All' || m.category === selectedCategory) &&
    (m.title.toLowerCase().includes(search.toLowerCase()) || m.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="min-h-screen p-6 bg-gradient-to-br from-purple-100/60 to-blue-100/60 flex flex-col items-center"
    >
      <h1 className="text-3xl font-bold mb-6 text-purple-700 drop-shadow-lg flex items-center gap-2">
        <BookOpen className="w-7 h-7 text-purple-400" /> Study Materials
      </h1>
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${selectedCategory === cat ? 'bg-purple-400 text-white shadow-lg' : 'bg-white/40 text-purple-700 hover:bg-purple-200/60'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="relative w-full max-w-xl mb-8">
        <input
          type="text"
          placeholder="Search study materials..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-4 rounded-xl bg-glass-100/60 border border-glass-200 text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow"
        />
        <Search className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
      </div>
      <div className="w-full max-w-3xl grid gap-6">
        {filtered.length === 0 && (
          <GlassCard className="p-8 text-center text-gray-400 text-lg">No study materials found.</GlassCard>
        )}
        {filtered.map((m) => (
          <motion.a
            key={m.id}
            href={m.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <GlassCard className="flex items-center gap-4 p-6 cursor-pointer hover:bg-purple-100/40 transition">
              <div>{icons[m.type as keyof typeof icons]}</div>
              <div>
                <div className="text-lg font-semibold text-purple-800">{m.title}</div>
                <div className="text-sm text-gray-500">{m.desc}</div>
                <div className="text-xs text-gray-400 mt-1">{m.category}</div>
              </div>
            </GlassCard>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default StudyMaterialsPage; 