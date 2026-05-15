const BEEP_BASE64 = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCuBzvLZiTYIG2m98OScTgwOUrDj7Rade';

export function playBeep(): void {
  try {
    const audio = new Audio(BEEP_BASE64);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // Audio not supported
  }
}
