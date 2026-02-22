import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env.DEV) return window.location.origin;
  return window.location.origin;
};

let socketInstance = null;

export const socket = {
  connect(token) {
    if (socketInstance) socketInstance.disconnect();
    socketInstance = io(getSocketUrl(), {
      auth: { token },
      path: '/socket.io',
    });
    return socketInstance;
  },
  disconnect() {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  },
  on(event, cb) {
    if (socketInstance) socketInstance.on(event, cb);
  },
  off(event, cb) {
    if (socketInstance) socketInstance.off(event, cb);
  },
};
