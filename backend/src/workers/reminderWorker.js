import { findDueReminders, markReminderAsNotified } from "../repository/reminderRepository.js";
import { emitReminderNotification } from "../services/socketService.js";

class ReminderWorker {
  constructor(intervalMs = 10000) { // Default 10 seconds
    this.intervalMs = intervalMs;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Reminder worker is already running');
      return;
    }

    console.log(`Starting reminder worker with interval ${this.intervalMs}ms`);
    this.isRunning = true;
    
    // Run immediately on start
    this.checkReminders();
    
    // Then run on interval
    this.intervalId = setInterval(() => {
      this.checkReminders();
    }, this.intervalMs);
  }

  stop() {
    if (!this.isRunning) {
      console.log('Reminder worker is not running');
      return;
    }

    console.log('Stopping reminder worker');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async checkReminders() {
    try {
      const now = new Date();
      
      // Find due reminders using repository function
      const dueReminders = await findDueReminders(now);

      console.log(`Found ${dueReminders.length} due reminders to process`);

      for (const reminder of dueReminders) {
        try {
          // Send notification via Socket.IO
          const message = `Đến giờ "${reminder.title}" rồi!`;
          emitReminderNotification(reminder.userId, message, reminder.id);

          // Mark as notified using repository function
          await markReminderAsNotified(reminder.id);

          console.log(`Processed reminder #${reminder.id} for user ${reminder.userId}: ${reminder.title}`);
        } catch (error) {
          console.error(`Error processing reminder #${reminder.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in reminder worker:', error);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs,
      intervalId: this.intervalId ? 'active' : 'inactive'
    };
  }
}

// Create singleton instance
const reminderWorker = new ReminderWorker(10000); // 10 seconds

export default reminderWorker;
