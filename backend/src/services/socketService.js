let io = null;

export const initializeSocket = (socketIo) => {
  io = socketIo;
  console.log('Socket service initialized');
};

export const emitReminderNotification = (userId, message, reminderId = null) => {
  if (!io) {
    console.error('Socket.IO not initialized');
    return;
  }

  // Emit to specific user room
  io.to(`user_${userId}`).emit('reminder_notification', {
    type: 'reminder',
    message,
    reminderId,
    timestamp: new Date().toISOString(),
    userId
  });

  console.log(`Reminder notification sent to user ${userId}: ${message}`);
};

export const emitToUser = (userId, event, data) => {
  if (!io) {
    console.error('Socket.IO not initialized');
    return;
  }

  io.to(`user_${userId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
    userId
  });

  console.log(`Event ${event} sent to user ${userId}`);
};
