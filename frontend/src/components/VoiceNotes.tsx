import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Download, X, Volume2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { playNotificationSound } from '../utils/soundEffects';

interface VoiceNote {
  id: string;
  title: string;
  duration: number;
  blob: Blob;
  timestamp: Date;
  waveform: number[];
}

interface VoiceNotesProps {
  onClose?: () => void;
}

export const VoiceNotes: React.FC<VoiceNotesProps> = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<VoiceNote | null>(null);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128));
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        // Create audio element to get duration
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          const newNote: VoiceNote = {
            id: Date.now().toString(),
            title: recordingTitle || `Voice Note ${notes.length + 1}`,
            duration: audio.duration,
            blob,
            timestamp: new Date(),
            waveform: generateWaveform(audioData)
          };
          
          setNotes(prev => [newNote, ...prev]);
          setRecordingTitle('');
          setShowSaveModal(false);
          playNotificationSound();
        };
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();
      
      // Start audio analysis
      const source = audioContextRef.current!.createMediaStreamSource(stream);
      source.connect(analyserRef.current!);
      
      const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);
      
      const updateAudioData = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          setAudioData(dataArray);
          setWaveformData(Array.from(dataArray).slice(0, 64));
          animationFrameRef.current = requestAnimationFrame(updateAudioData);
        }
      };
      
      updateAudioData();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      setShowSaveModal(true);
    }
  };

  const playNote = (note: VoiceNote) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const url = URL.createObjectURL(note.blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
      setSelectedNote(note);
      setIsPlaying(true);
      audio.play();
    };
    
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
  };

  const pauseNote = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const generateWaveform = (data: Uint8Array): number[] => {
    return Array.from(data).slice(0, 64).map(value => value / 255);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Voice Notes</h1>
              <p className="text-gray-300">Record and organize your study notes with voice</p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-glass-100/30 rounded-lg text-white hover:bg-glass-200/30 transition-all duration-300"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              {onClose && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 bg-glass-100/30 rounded-lg text-white hover:bg-glass-200/30 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recording Section */}
      <div className="mb-6">
        <GlassCard className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Record New Note</h2>
            
            {/* Recording Button */}
            <div className="mb-6">
              {!isRecording ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={startRecording}
                  className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                >
                  <Mic className="w-8 h-8" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopRecording}
                  className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 animate-pulse"
                >
                  <Square className="w-8 h-8" />
                </motion.button>
              )}
            </div>

            {/* Live Waveform */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <div className="flex items-center justify-center space-x-1 h-16">
                  {waveformData.map((value, index) => (
                    <motion.div
                      key={index}
                      animate={{ height: `${value * 60}px` }}
                      transition={{ duration: 0.1 }}
                      className="w-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
                    />
                  ))}
                </div>
                <p className="text-red-400 text-sm font-medium animate-pulse">Recording...</p>
              </motion.div>
            )}

            {/* Recording Status */}
            <p className="text-gray-300">
              {isRecording ? 'Click the button to stop recording' : 'Click the button to start recording'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Player Section */}
      {selectedNote && (
        <div className="mb-6">
          <GlassCard className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">{selectedNote.title}</h3>
              
              {/* Waveform Display */}
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-1 h-16">
                  {selectedNote.waveform.map((value, index) => (
                    <div
                      key={index}
                      className="w-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
                      style={{ height: `${value * 60}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-glass-100/30 rounded-full h-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentTime / duration) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-300 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                {isPlaying ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={pauseNote}
                    className="p-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl text-white hover:shadow-lg transition-all duration-300"
                  >
                    <Pause className="w-6 h-6" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playNote(selectedNote)}
                    className="p-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl text-white hover:shadow-lg transition-all duration-300"
                  >
                    <Play className="w-6 h-6" />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteNote(selectedNote.id)}
                  className="p-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl text-white hover:shadow-lg transition-all duration-300"
                >
                  <Trash2 className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Notes List */}
      <div className="mb-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Voice Notes</h3>
          
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <Volume2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">No voice notes yet. Start recording to create your first note!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map(note => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedNote?.id === note.id 
                      ? 'bg-glass-200/50 border border-blue-400' 
                      : 'bg-glass-100/30 hover:bg-glass-100/50'
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{note.title}</h4>
                      <p className="text-gray-300 text-sm">{formatDate(note.timestamp)}</p>
                      <p className="text-gray-400 text-sm">{formatTime(note.duration)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          playNote(note);
                        }}
                        className="p-2 bg-blue-500 rounded-lg text-white"
                      >
                        <Play className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-2 bg-red-500 rounded-lg text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6 w-96">
                <h3 className="text-xl font-bold text-white mb-4">Save Voice Note</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Note Title</label>
                    <input
                      type="text"
                      value={recordingTitle}
                      onChange={(e) => setRecordingTitle(e.target.value)}
                      className="w-full p-3 rounded-lg bg-glass-100/50 border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter note title..."
                      autoFocus
                    />
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-4 py-2 bg-glass-100/50 rounded-lg text-white font-semibold hover:bg-glass-200/50 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 