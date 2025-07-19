import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SoundContextType {
  // Audio states
  isMuted: boolean;
  masterVolume: number;
  ambientVolume: number;
  musicVolume: number;
  sfxVolume: number;
  
  // Audio controls
  toggleMute: () => void;
  setMasterVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  
  // Sound functions
  playAmbient: (type: 'library' | 'nature' | 'cafe' | 'rain' | 'forest') => void;
  stopAmbient: () => void;
  playAchievement: (type: 'streak' | 'mastery' | 'speed' | 'perfect' | 'warrior') => void;
  playNotification: (type: 'success' | 'warning' | 'error' | 'info') => void;
  playStudyMusic: (type: 'lofi' | 'classical' | 'nature' | 'instrumental') => void;
  stopStudyMusic: () => void;
  playSfx: (type: 'click' | 'hover' | 'success' | 'error' | 'pageTurn' | 'notification') => void;
  
  // Current playing
  currentAmbient: string | null;
  currentMusic: string | null;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

interface SoundProviderProps {
  children: React.ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [sfxVolume, setSfxVolume] = useState(0.6);
  
  const [currentAmbient, setCurrentAmbient] = useState<string | null>(null);
  const [currentMusic, setCurrentMusic] = useState<string | null>(null);
  
  // Audio refs
  const ambientAudio = useRef<HTMLAudioElement | null>(null);
  const musicAudio = useRef<HTMLAudioElement | null>(null);
  
  // Sound URLs (using placeholder URLs - replace with actual audio files)
  const soundUrls = {
    ambient: {
      library: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      nature: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      cafe: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      rain: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      forest: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    },
    achievement: {
      streak: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      mastery: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      speed: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      perfect: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      warrior: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    },
    notification: {
      success: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      warning: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      error: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      info: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    },
    music: {
      lofi: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      classical: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      nature: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      instrumental: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    },
    sfx: {
      click: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      hover: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      success: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      error: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      pageTurn: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      notification: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    },
  };

  // Helper function to play audio
  const playAudio = (url: string, volume: number = 1, loop: boolean = false) => {
    if (isMuted) return;
    
    const audio = new Audio(url);
    audio.volume = volume * masterVolume;
    audio.loop = loop;
    
    audio.play().catch(error => {
      console.log('Audio play failed:', error);
    });
    
    return audio;
  };

  // Ambient sounds
  const playAmbient = (type: 'library' | 'nature' | 'cafe' | 'rain' | 'forest') => {
    stopAmbient();
    const url = soundUrls.ambient[type];
    ambientAudio.current = playAudio(url, ambientVolume, true) as HTMLAudioElement;
    setCurrentAmbient(type);
  };

  const stopAmbient = () => {
    if (ambientAudio.current) {
      ambientAudio.current.pause();
      ambientAudio.current = null;
    }
    setCurrentAmbient(null);
  };

  // Achievement sounds
  const playAchievement = (type: 'streak' | 'mastery' | 'speed' | 'perfect' | 'warrior') => {
    const url = soundUrls.achievement[type];
    playAudio(url, sfxVolume);
  };

  // Notification sounds
  const playNotification = (type: 'success' | 'warning' | 'error' | 'info') => {
    const url = soundUrls.notification[type];
    playAudio(url, sfxVolume);
  };

  // Study music
  const playStudyMusic = (type: 'lofi' | 'classical' | 'nature' | 'instrumental') => {
    stopStudyMusic();
    const url = soundUrls.music[type];
    musicAudio.current = playAudio(url, musicVolume, true) as HTMLAudioElement;
    setCurrentMusic(type);
  };

  const stopStudyMusic = () => {
    if (musicAudio.current) {
      musicAudio.current.pause();
      musicAudio.current = null;
    }
    setCurrentMusic(null);
  };

  // Sound effects
  const playSfx = (type: 'click' | 'hover' | 'success' | 'error' | 'pageTurn' | 'notification') => {
    const url = soundUrls.sfx[type];
    playAudio(url, sfxVolume);
  };

  // Volume controls
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (ambientAudio.current) {
      ambientAudio.current.muted = !isMuted;
    }
    if (musicAudio.current) {
      musicAudio.current.muted = !isMuted;
    }
  };

  const updateMasterVolume = (volume: number) => {
    setMasterVolume(volume);
    if (ambientAudio.current) {
      ambientAudio.current.volume = ambientVolume * volume;
    }
    if (musicAudio.current) {
      musicAudio.current.volume = musicVolume * volume;
    }
  };

  const updateAmbientVolume = (volume: number) => {
    setAmbientVolume(volume);
    if (ambientAudio.current) {
      ambientAudio.current.volume = volume * masterVolume;
    }
  };

  const updateMusicVolume = (volume: number) => {
    setMusicVolume(volume);
    if (musicAudio.current) {
      musicAudio.current.volume = volume * masterVolume;
    }
  };

  const updateSfxVolume = (volume: number) => {
    setSfxVolume(volume);
  };

  // Update audio volumes when settings change
  useEffect(() => {
    if (ambientAudio.current) {
      ambientAudio.current.volume = ambientVolume * masterVolume;
    }
    if (musicAudio.current) {
      musicAudio.current.volume = musicVolume * masterVolume;
    }
  }, [ambientVolume, musicVolume, masterVolume]);

  const value: SoundContextType = {
    isMuted,
    masterVolume,
    ambientVolume,
    musicVolume,
    sfxVolume,
    toggleMute,
    setMasterVolume: updateMasterVolume,
    setAmbientVolume: updateAmbientVolume,
    setMusicVolume: updateMusicVolume,
    setSfxVolume: updateSfxVolume,
    playAmbient,
    stopAmbient,
    playAchievement,
    playNotification,
    playStudyMusic,
    stopStudyMusic,
    playSfx,
    currentAmbient,
    currentMusic,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}; 