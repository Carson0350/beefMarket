import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { sendInventoryChangeEmail, sendPriceChangeEmail } from '../email';
import type { NotificationJob } from '../queue';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Process notification jobs
export const notificationWorker = new Worker<NotificationJob>(
  'notifications',
  async (job: Job<NotificationJob>) => {
    const { type, userEmail, bull, changeData } = job.data;

    console.log(`Processing notification job ${job.id} for ${userEmail}`);

    try {
      if (type === 'inventory_change') {
        await sendInventoryChangeEmail({
          userEmail,
          bull,
          oldInventory: changeData.oldInventory,
          newInventory: changeData.newInventory,
          changeType: changeData.changeType,
        });
      } else if (type === 'price_change') {
        await sendPriceChangeEmail({
          userEmail,
          bull,
          oldPrice: changeData.oldPrice,
          newPrice: changeData.newPrice,
          priceDifference: changeData.priceDifference,
          percentageChange: changeData.percentageChange,
          isDecrease: changeData.isDecrease,
        });
      }

      console.log(`Successfully sent ${type} notification to ${userEmail}`);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send notification to ${userEmail}:`, error);
      throw error; // Will trigger retry
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 jobs concurrently
    limiter: {
      max: 10, // Max 10 jobs
      duration: 1000, // Per second (rate limiting)
    },
  }
);

// Event listeners
notificationWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await notificationWorker.close();
  await connection.quit();
});
