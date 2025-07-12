import { Router } from "express";
import {
    sendRecruitmentNotification,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadCount
} from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

// Protected routes - require authentication
router.use(isAuthenticated);

// Send recruitment notification to all gamers (only for org role)
router.post("/recruitment", checkRole(['org']), sendRecruitmentNotification);

// Get user's notifications
router.get("/", getNotifications);

// Mark notification as read
router.patch("/:notificationId/read", markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", markAllNotificationsAsRead);

// Get unread notification count
router.get("/unread-count", getUnreadCount);

export default router; 