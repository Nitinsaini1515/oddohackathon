const Notification = require('../models/Notification.model');

const createNotification = async ({ userId, type, title, message, link, metadata }) => {
  return Notification.create({
    userId,
    type,
    title,
    message,
    link,
    metadata,
  });
};

const notifyUsers = async (userIds, payload) => {
  const notifications = userIds.map((userId) => ({
    userId,
    ...payload,
  }));
  return Notification.insertMany(notifications);
};

module.exports = { createNotification, notifyUsers };
