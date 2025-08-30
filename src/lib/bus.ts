type Events = 'db-changed';
type Handler = () => void;

const listeners: Record<Events, Set<Handler>> = {
  'db-changed': new Set(),
};

export function on(type: Events, cb: Handler) {
  listeners[type].add(cb);
  return () => off(type, cb);
}

export function off(type: Events, cb: Handler) {
  listeners[type].delete(cb);
}

export function emit(type: Events) {
  listeners[type].forEach((cb) => cb());
}
