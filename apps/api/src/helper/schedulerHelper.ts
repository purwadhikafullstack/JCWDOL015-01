import cron from 'node-cron';
import { checkAndUpdateSubscriptions } from '../controllers/subsExpiry.controller';

// Fungsi untuk menjadwalkan pengecekan subscription
export const scheduleSubscriptionCheck = () => {
    // Menjadwalkan untuk mengecek subscription setiap hari pada tengah malam
    cron.schedule('0 0 * * *', () => {
        console.log('Checking subscriptions...');
        checkAndUpdateSubscriptions();
    });
};
