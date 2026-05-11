import { initializeSocket } from "../services/socketService.js";

export const initializeSocketHandlers = (io) => {
  // Initialize socket service
  initializeSocket(io);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user to their personal room
    socket.on('join_user_room', (userId) => {
      const roomName = `user_${userId}`;
      socket.join(roomName);
      console.log(`User ${userId} joined room ${roomName}`);
      
      // Acknowledge join
      socket.emit('joined_user_room', { 
        userId, 
        room: roomName,
        message: 'Successfully joined user room' 
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Handle reminder acknowledgment
    socket.on('acknowledge_reminder', (data) => {
      console.log(`User acknowledged reminder:`, data);
      // Could update reminder status here if needed
    });

    // Handle custom events
    socket.on('custom_event', (data) => {
      console.log('Custom event received:', data);
    });
  });

  console.log('Socket handlers initialized');
};