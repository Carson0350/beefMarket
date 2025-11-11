import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';

// Redis connection configuration
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Notification queue
export const notificationQueue = new Queue('notifications', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
});

// Queue events for monitoring
export const queueEvents = new QueueEvents('notifications', { connection });

// Job types
export interface NotificationJob {
  type: 'inventory_change' | 'price_change';
  userId: string;
  bullId: string;
  userEmail: string;
  bull: {
    id: string;
    name: string;
    slug: string;
    heroImage: string;
    ranch: {
      name: string;
      contactEmail: string;
      contactPhone: string;
    };
  };
  changeData: any;
}

// Add notification to queue
export async function queueNotification(job: NotificationJob) {
  await notificationQueue.add('send-notification', job, {
    // Group by user for potential batching
    jobId: `${job.userId}-${job.bullId}-${Date.now()}`,
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await notificationQueue.close();
  await connection.quit();
});
