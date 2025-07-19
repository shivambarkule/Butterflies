// Sound effects utility
class SoundEffects {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  private isEnabled = true;

  constructor() {
    this.initAudioContext();
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Audio context not supported');
    }
  }

  // Generate typing sound using Web Audio API
  playTypingSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create a short, soft click sound
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      // Fallback to simple beep
      this.playFallbackSound();
    }
  }

  // Fallback typing sound
  private playFallbackSound() {
    if (!this.isEnabled) return;

    try {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
      audio.volume = 0.1;
      audio.play().catch(() => {});
    } catch (error) {
      // Silent fallback
    }
  }

  // Play success sound
  playSuccessSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create a pleasant success sound
      oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      // Silent fallback
    }
  }

  // Play error sound
  playErrorSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create a warning sound
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      // Silent fallback
    }
  }

  // Play notification sound
  playNotificationSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create a gentle notification sound
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
      oscillator.frequency.setValueAtTime(554, this.audioContext.currentTime + 0.1); // C#5

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      // Silent fallback
    }
  }

  // Toggle sound on/off
  toggleSound() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  // Set sound enabled/disabled
  setSoundEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Get sound status
  isSoundEnabled() {
    return this.isEnabled;
  }
}

// Create singleton instance
export const soundManager = new SoundEffects();

// Export individual functions for convenience
export const playTypingSound = () => soundManager.playTypingSound();
export const playSuccessSound = () => soundManager.playSuccessSound();
export const playErrorSound = () => soundManager.playErrorSound();
export const playNotificationSound = () => soundManager.playNotificationSound();
export const toggleSound = () => soundManager.toggleSound();
export const setSoundEnabled = (enabled: boolean) => soundManager.setSoundEnabled(enabled);
export const isSoundEnabled = () => soundManager.isSoundEnabled(); 