
import { useCallback } from 'react';

export const useSound = () => {
    const playSound = useCallback((frequency: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
            
            // Close context after sound finishes to save resources
            setTimeout(() => {
                audioCtx.close();
            }, duration * 1000 + 100);
        } catch (e) {
            console.warn('Audio not supported or blocked', e);
        }
    }, []);

    const playCorrect = useCallback(() => {
        // A pleasant high-pitched beep
        playSound(880, 'sine', 0.15);
        setTimeout(() => playSound(1108, 'sine', 0.2), 100);
    }, [playSound]);

    const playIncorrect = useCallback(() => {
        // A low-pitched discordant sound
        playSound(220, 'sawtooth', 0.3);
    }, [playSound]);

    const playHighPitch = useCallback(() => {
        playSound(1320, 'sine', 0.2);
    }, [playSound]);

    const playLowPitch = useCallback(() => {
        playSound(330, 'sine', 0.2);
    }, [playSound]);

    return { playCorrect, playIncorrect, playHighPitch, playLowPitch };
};
