const EVENT_NAME = 'app:flash-message';
const STORAGE_KEY = '__logipop_flash_queue__';

const VARIANT_STYLES = {
  success: 'border border-emerald-300/80 bg-emerald-500/95 text-emerald-50 shadow-emerald-900/30',
  error: 'border border-destructive/40 bg-destructive/95 text-destructive-foreground shadow-destructive/30',
  warning: 'border border-amber-300/70 bg-amber-500/95 text-amber-50 shadow-amber-900/25',
  muted: 'border border-border/70 bg-background/95 text-foreground shadow-black/5',
};

const BASE_CLASS = 'pointer-events-auto w-full max-w-md translate-y-2 opacity-0 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg ring-1 ring-black/10 backdrop-blur transition duration-200 ease-out';
const CONTAINER_CLASS = 'pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-3 px-4 sm:px-6';

let containerEl = null;

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const ensureContainer = () => {
  if (!isBrowser()) return null;
  if (containerEl && document.body.contains(containerEl)) return containerEl;

  containerEl = document.createElement('div');
  containerEl.id = 'flash-message-root';
  containerEl.className = CONTAINER_CLASS;
  document.body.appendChild(containerEl);
  return containerEl;
};

const teardownContainerIfEmpty = () => {
  if (containerEl && containerEl.children.length === 0) {
    containerEl.remove();
    containerEl = null;
  }
};

const safeParse = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_err) {
    return [];
  }
};

const readStoredMessages = () => {
  if (!isBrowser()) return [];
  return safeParse(window.sessionStorage.getItem(STORAGE_KEY));
};

const writeStoredMessages = (messages) => {
  if (!isBrowser()) return;
  if (!messages || messages.length === 0) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

const consumeStoredMessages = () => {
  const messages = readStoredMessages();
  if (messages.length > 0) {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
  return messages;
};

const renderFlash = (payload) => {
  if (!payload || !payload.message || !isBrowser()) return () => {};

  const container = ensureContainer();
  if (!container) return () => {};

  const flash = document.createElement('div');
  flash.role = 'status';
  flash.dataset.flashId = payload.id;
  flash.ariaLive = payload.variant === 'error' ? 'assertive' : 'polite';
  flash.className = `${BASE_CLASS} ${VARIANT_STYLES[payload.variant] || VARIANT_STYLES.muted}`;
  flash.textContent = payload.message;

  const close = () => {
    flash.classList.add('opacity-0', 'translate-y-2');
    flash.classList.remove('opacity-100', 'translate-y-0');
    window.setTimeout(() => {
      flash.remove();
      teardownContainerIfEmpty();
    }, 180);
  };

  container.appendChild(flash);

  requestAnimationFrame(() => {
    flash.classList.remove('opacity-0', 'translate-y-2');
    flash.classList.add('opacity-100', 'translate-y-0');
  });

  let timeoutId = null;
  if (Number.isFinite(payload.duration) && payload.duration > 0) {
    timeoutId = window.setTimeout(close, payload.duration);
  }

  flash.addEventListener('click', () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    close();
  });

  return () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    close();
  };
};

const createPayload = (message, { variant = 'muted', duration = 4000 } = {}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  message,
  variant,
  duration,
});

const storeMessage = (payload) => {
  const queue = readStoredMessages();
  queue.push(payload);
  writeStoredMessages(queue);
};

const dispatchMessage = (payload) => {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));
};

const pushFlashInternal = (message, options = {}) => {
  if (!message || !isBrowser()) return null;
  const { persist = false, broadcast = true } = options;
  const payload = createPayload(message, options);

  if (persist) storeMessage(payload);
  if (broadcast) dispatchMessage(payload);

  return payload.id;
};

export const showFlash = (message, options = {}) => pushFlashInternal(message, { ...options, persist: options.persist ?? false, broadcast: true });

export const queueFlash = (message, options = {}) => pushFlashInternal(message, { ...options, persist: true, broadcast: options.broadcast ?? false });

export const showAndQueueFlash = (message, options = {}) => pushFlashInternal(message, { ...options, persist: true, broadcast: true });

export const bootstrapFlashMessages = () => {
  if (!isBrowser()) return () => {};

  const handler = (event) => {
    const payload = event?.detail;
    if (payload?.message) renderFlash(payload);
  };

  window.addEventListener(EVENT_NAME, handler);

  const queued = consumeStoredMessages();
  queued.forEach(renderFlash);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
};

