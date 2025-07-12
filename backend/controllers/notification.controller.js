import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';
import { Recruitment } from '../models/recruitment.model.js';

// Send recruitment notification to all gamers
export const sendRecruitmentNotification = async (req, res) => {
    try {
        const { game, position, requirements, contactInfo } = req.body;
        const orgId = req.id;

        if (!game || !position || !requirements || !contactInfo) {
            return res.status(400).json({
                message: "All recruitment fields are required",
                success: false
            });
        }

        // Get organization details
        const org = await User.findById(orgId);
        if (!org) {
            return res.status(404).json({
                message: "Organization not found",
                success: false
            });
        }

        // Get all gamers
        const gamers = await User.find({ role: 'gamer' });
        
        if (gamers.length === 0) {
            return res.status(404).json({
                message: "No gamers found",
                success: false
            });
        }

        // Create a recruitment record
        const recruitment = await Recruitment.create({
            orgId,
            game,
            requirement: `${position} - ${requirements}`,
            contactInfo
        });

        // Create notifications for all gamers
        const notifications = gamers.map(gamer => ({
            sender: orgId,
            recipient: gamer._id,
            type: 'recruitment',
            title: `New Recruitment Opportunity - ${game}`,
            message: `${org.username} is looking for ${position} players for ${game}`,
            recruitmentDetails: {
                game,
                position,
                requirements,
                contactInfo
            }
        }));

        await Notification.insertMany(notifications);

        // Emit socket event for new recruitment
        const io = req.app.get('io');
        if (io) {
            console.log('Emitting recruitment_added event:', { recruitmentId: recruitment._id });
            io.emit('recruitment_added', { recruitment });
        } else {
            console.log('Socket.io not available for recruitment_added event');
        }

        res.status(200).json({
            message: "Recruitment notifications sent successfully",
            success: true,
            data: { 
                count: notifications.length,
                recruitment: recruitment
            }
        });
    } catch (error) {
        console.error('Error sending recruitment notification:', error);
        return res.status(500).json({
            message: "Something went wrong while sending recruitment notification",
            success: false,
            error: error.message
        });
    }
};

// Get notifications for a user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const { page = 1, limit = 10 } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'username profilepic')
            .sort({ createdAt: -1 })
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        const total = await Notification.countDocuments({ recipient: userId });

        res.status(200).json({
            message: "Notifications fetched successfully",
            success: true,
            data: {
                notifications,
                total,
                page: options.page,
                totalPages: Math.ceil(total / options.limit)
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({
            message: "Something went wrong while fetching notifications",
            success: false,
            error: error.message
        });
    }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({
            message: "Something went wrong while marking notification as read",
            success: false,
            error: error.message
        });
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.id;

        await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );

        res.status(200).json({
            message: "All notifications marked as read",
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return res.status(500).json({
            message: "Something went wrong while marking all notifications as read",
            success: false,
            error: error.message
        });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.id;

        const count = await Notification.countDocuments({
            recipient: userId,
            read: false
        });

        res.status(200).json({
            message: "Unread count fetched successfully",
            success: true,
            data: { count }
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        return res.status(500).json({
            message: "Something went wrong while getting unread count",
            success: false,
            error: error.message
        });
    }
}; 

// Remove all notifications for a recruitment
export const removeRecruitmentNotifications = async (recruitment) => {
    const { game, requirement, contactInfo } = recruitment;
    // The notificationDetails fields may be split, so parse position/requirements if needed
    // For now, match on game and contactInfo (most unique fields)
    await Notification.deleteMany({
        type: 'recruitment',
        'recruitmentDetails.game': game,
        'recruitmentDetails.contactInfo': contactInfo
    });
}; 