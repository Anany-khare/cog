import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://cog-csr2.onrender.com';
    socketRef.current = io(backendUrl, {
      withCredentials: true,
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    // Debug: Listen for recruitment events
    socketRef.current.on('recruitment_added', (data) => {
      console.log('Socket: recruitment_added received:', data);
    });
    socketRef.current.on('recruitment_updated', (data) => {
      console.log('Socket: recruitment_updated received:', data);
    });
    socketRef.current.on('recruitment_closed', (data) => {
      console.log('Socket: recruitment_closed received:', data);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};

export default useSocket; 