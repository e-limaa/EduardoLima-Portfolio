// One background-music element for the whole app.
//
// iOS Safari only allows play() inside the user gesture itself, so the welcome
// screen's Enter click calls start() directly instead of waiting for the
// (deferred) player UI to mount. Keeping the element outside React also means
// navigating away and back no longer restarts music the visitor had paused.

export const PLAYLIST = [
  {
    title: "Rollercoastin - Roddy Ricch (Instrumental)",
    src: "https://audio-assets.vercel.app/Rollercoastin.mp3",
  },
  {
    title: "Awake - Tycho",
    src: "https://audio-assets.vercel.app/Tycho-Awake.mp3",
  },
  {
    title: "Photosynthesis",
    src: "https://audio-assets.vercel.app/Carbon Based Lifeforms - Photosynthesis.mp3",
  },
];

export interface BackgroundAudioState {
  isPlaying: boolean;
  isMuted: boolean;
  trackIndex: number;
}

let audio: HTMLAudioElement | null = null;
let state: BackgroundAudioState = { isPlaying: false, isMuted: false, trackIndex: 0 };
const listeners = new Set<() => void>();

const setState = (patch: Partial<BackgroundAudioState>) => {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
};

const element = () => {
  if (audio || typeof Audio === "undefined") return audio;
  audio = new Audio();
  audio.preload = "none";
  audio.volume = 0.1;
  audio.addEventListener("ended", () => backgroundAudio.next());
  audio.addEventListener("pause", () => setState({ isPlaying: false }));
  audio.addEventListener("play", () => setState({ isPlaying: true }));
  return audio;
};

const play = () => {
  const el = element();
  if (!el) return;
  const src = encodeURI(PLAYLIST[state.trackIndex].src);
  if (!el.src.endsWith(src)) el.src = src;
  el.play().catch(() => setState({ isPlaying: false }));
};

export const backgroundAudio = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getState: () => state,
  /** Call from a click handler: browsers reject audio started outside a gesture. */
  start: play,
  toggle() {
    if (state.isPlaying) {
      element()?.pause();
      setState({ isPlaying: false });
    } else {
      play();
    }
  },
  next() {
    setState({ trackIndex: (state.trackIndex + 1) % PLAYLIST.length });
    play();
  },
  toggleMute() {
    const el = element();
    if (!el) return;
    el.muted = !state.isMuted;
    setState({ isMuted: el.muted });
  },
};
