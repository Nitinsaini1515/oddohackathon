const Notification = require('../models/Notification.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { userId: req.user._id };
  if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ userId: req.user._id, isRead: false }),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      notifications,
      unreadCount,
      pagination: buildPaginationMeta(total, page, limit),
    }, 'Notifications fetched')
  );
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
  res.status(200).json(new ApiResponse(200, { unreadCount }, 'Unread count fetched'));
});

const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create({
    ...req.body,
    userId: req.body.userId || req.user._id,
  });
  res.status(201).json(new ApiResponse(201, { notification }, 'Notification created'));
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
  if (!notification) throw new ApiError(404, 'Notification not found');

  notification.isRead = true;
  await notification.save();

  res.status(200).json(new ApiResponse(200, { notification }, 'Notification marked as read'));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
});

module.exports = {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
