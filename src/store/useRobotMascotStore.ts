import { create } from 'zustand';

export interface RobotMessageData {
  title?: string;
  text: string;
  domainId?: string;
}

export const DEFAULT_ROBOT_SPEECHES = [
  'Hello!',
  'Think, Build, Renovate.',
  'Welcome to RS!',
  'Inventing the Future!',
];

// Thinking durations in milliseconds
export const DOMAIN_THINKING_DURATION_MS = 950;
export const CLICK_THINKING_DURATION_MS = 850;

interface RobotMascotState {
  // Domain selection & custom message
  selectedDomainId: string | null;
  activeMessage: RobotMessageData | null;
  triggerCount: number;

  // Animation & bubble state
  isWaving: boolean;
  isThinking: boolean;
  isBlinking: boolean;
  showSpeech: boolean;
  speechIndex: number;
  bubbleKey: string | number;
  activeImpulse: string | null;

  // Actions
  selectDomain: (domainId: string, title: string, message: string) => void;
  clearSelection: () => void;
  handleClickMascot: () => void;
  setThinking: (thinking: boolean) => void;
  setWaving: (waving: boolean) => void;
  setBlinking: (blinking: boolean) => void;
  setShowSpeech: (show: boolean) => void;
  cycleNextSpeech: () => void;
  triggerImpulse: (domainId: string) => void;
  resetMascotState: () => void;
}

let thinkingTimeout: NodeJS.Timeout | null = null;
let impulseTimeout: NodeJS.Timeout | null = null;

export const useRobotMascotStore = create<RobotMascotState>((set, get) => ({
  selectedDomainId: null,
  activeMessage: null,
  triggerCount: 0,

  isWaving: true,
  isThinking: false,
  isBlinking: false,
  showSpeech: true,
  speechIndex: 0,
  bubbleKey: 'initial-0',
  activeImpulse: null,

  selectDomain: (domainId: string, title: string, message: string) => {
    if (thinkingTimeout) clearTimeout(thinkingTimeout);

    const currentSelected = get().selectedDomainId;

    // Toggle off if already selected
    if (currentSelected === domainId) {
      set({
        selectedDomainId: null,
        activeMessage: null,
        isThinking: false,
        showSpeech: true,
        isWaving: true,
        bubbleKey: `default-${Date.now()}`,
      });
      return;
    }

    const nextCount = get().triggerCount + 1;

    // 1. Instantly trigger thinking animation
    set({
      selectedDomainId: domainId,
      activeMessage: null,
      isThinking: true,
      showSpeech: true,
      isWaving: true,
      triggerCount: nextCount,
      bubbleKey: `thinking-${domainId}-${nextCount}`,
    });

    // 2. Resolve to full domain insight message after thinking duration
    thinkingTimeout = setTimeout(() => {
      set({
        isThinking: false,
        activeMessage: {
          title,
          text: message,
          domainId,
        },
        bubbleKey: `content-${domainId}-${nextCount}`,
      });
    }, DOMAIN_THINKING_DURATION_MS);
  },

  handleClickMascot: () => {
    if (thinkingTimeout) clearTimeout(thinkingTimeout);

    const nextCount = get().triggerCount + 1;
    const nextSpeechIdx = (get().speechIndex + 1) % DEFAULT_ROBOT_SPEECHES.length;

    set({
      isThinking: true,
      showSpeech: true,
      isWaving: true,
      triggerCount: nextCount,
      bubbleKey: `click-thinking-${nextCount}`,
    });

    thinkingTimeout = setTimeout(() => {
      set({
        isThinking: false,
        speechIndex: nextSpeechIdx,
        activeMessage: null,
        selectedDomainId: null,
        bubbleKey: `speech-${nextSpeechIdx}-${nextCount}`,
      });
    }, CLICK_THINKING_DURATION_MS);
  },

  clearSelection: () => {
    if (thinkingTimeout) clearTimeout(thinkingTimeout);
    set({
      selectedDomainId: null,
      activeMessage: null,
      isThinking: false,
      showSpeech: true,
      bubbleKey: `cleared-${Date.now()}`,
    });
  },

  setThinking: (isThinking: boolean) => set({ isThinking }),
  setWaving: (isWaving: boolean) => set({ isWaving }),
  setBlinking: (isBlinking: boolean) => set({ isBlinking }),
  setShowSpeech: (showSpeech: boolean) => set({ showSpeech }),

  cycleNextSpeech: () => {
    const nextIdx = (get().speechIndex + 1) % DEFAULT_ROBOT_SPEECHES.length;
    set({
      speechIndex: nextIdx,
      bubbleKey: `cycle-${nextIdx}-${Date.now()}`,
    });
  },

  triggerImpulse: (domainId: string) => {
    if (impulseTimeout) clearTimeout(impulseTimeout);
    set({ activeImpulse: domainId });
    impulseTimeout = setTimeout(() => {
      set({ activeImpulse: null });
    }, 850);
  },

  resetMascotState: () => {
    if (thinkingTimeout) clearTimeout(thinkingTimeout);
    if (impulseTimeout) clearTimeout(impulseTimeout);
    set({
      selectedDomainId: null,
      activeMessage: null,
      isThinking: false,
      isWaving: true,
      showSpeech: true,
      speechIndex: 0,
      bubbleKey: 0,
      activeImpulse: null,
    });
  },
}));
