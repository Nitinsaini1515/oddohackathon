const cron = require('node-cron');
const User = require('../models/User.model');
const { ROLES } = require('../utils/constants');
const { getWarrantyReminders } = require('./innovation.service');
const { createNotification, notifyUsers } = require('./notification.service');
const { NOTIFICATION_TYPES } = require('../utils/constants');

const startCronJobs = () => {
  cron.schedule('0 8 * * *', async () => {
    try {
      const expiring = await getWarrantyReminders(30);
      if (!expiring.length) return;

      const admins = await User.find({
        role: { $in: [ROLES.ADMIN, ROLES.ASSET_MANAGER] },
        isActive: true,
      }).select('_id');

      const adminIds = admins.map((a) => a._id);

      for (const asset of expiring) {
        await notifyUsers(adminIds, {
          type: NOTIFICATION_TYPES.WARRANTY,
          title: 'Warranty Expiring Soon',
          message: `${asset.name} (${asset.assetTag}) warranty expires on ${new Date(asset.warrantyExpiry).toDateString()}`,
          link: `/assets/${asset._id}`,
          metadata: { assetId: asset._id },
        });
      }

      console.log(`[Cron] Warranty reminders sent for ${expiring.length} assets`);
    } catch (error) {
      console.error('[Cron] Warranty reminder job failed:', error.message);
    }
  });

  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();
      await require('../models/Booking.model').Booking.updateMany(
        { status: 'Upcoming', endDate: { $lt: now } },
        { $set: { status: 'Completed' } }
      );
      console.log('[Cron] Auto-completed expired bookings');
    } catch (error) {
      console.error('[Cron] Booking status job failed:', error.message);
    }
  });

  console.log('[Cron] Scheduled jobs initialized');
};

module.exports = { startCronJobs };
