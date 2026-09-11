// Module-level session state so Roti speech bubble shows only once per login session
let sessionRotiBubbleDismissed = false;

export const resetRotiSpeechBubbleSession = () => {
  sessionRotiBubbleDismissed = false;
};

export const dismissRotiSpeechBubbleSession = () => {
  sessionRotiBubbleDismissed = true;
};

export const isRotiSpeechBubbleDismissed = () => {
  return sessionRotiBubbleDismissed;
};
