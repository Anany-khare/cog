import { Recruitment } from '../models/recruitment.model.js';
import { User } from '../models/user.model.js';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { removeRecruitmentNotifications } from './notification.controller.js';

// Org creates a recruitment post
export const addRecruitment = async (req, res) => {
  try {
    const { orgId, game, requirement } = req.body;
    if (!orgId || !game || !requirement) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const recruitment = await Recruitment.create({ orgId, game, requirement });
    // TODO: Send notification to all gamers
    return res.status(201).json({ success: true, recruitment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Gamer submits a response to a recruitment
export const submitResponse = async (req, res) => {
  try {
    const { recruitmentId } = req.params;
    const { gameDetail, inGameUserId } = req.body;
    const screenshot = req.file;
    const gamerId = req.id; // Get gamer ID from authenticated user

    console.log('Received request:', {
      recruitmentId,
      gameDetail,
      inGameUserId,
      hasFile: !!screenshot,
      fileInfo: screenshot ? { name: screenshot.originalname, size: screenshot.size } : null,
      body: req.body
    });

    if (!gameDetail || !inGameUserId || !screenshot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields.',
        received: { gameDetail: !!gameDetail, inGameUserId: !!inGameUserId, screenshot: !!screenshot }
      });
    }

    const recruitment = await Recruitment.findById(recruitmentId);
    if (!recruitment) {
      return res.status(404).json({ success: false, message: 'Recruitment not found.' });
    }

    // Upload screenshot to Cloudinary
    const fileUri = getDataUri(screenshot);
    console.log('Uploading to Cloudinary:', { fileName: screenshot.originalname, size: screenshot.size });
    
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      folder: 'recruitment-screenshots',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit' }
      ]
    });
    
    console.log('Cloudinary upload successful:', { url: cloudResponse.secure_url });

    // Add response to recruitment
    recruitment.responses.push({ 
      gamerId, 
      gameDetail, 
      inGameUserId,
      screenshotUrl: cloudResponse.secure_url 
    });
    await recruitment.save();

    // Emit socket event for recruitment update
    const io = req.app.get('io');
    if (io) {
      console.log('Emitting recruitment_updated event:', { recruitmentId: recruitment._id });
      io.emit('recruitment_updated', { recruitment });
    } else {
      console.log('Socket.io not available for recruitment_updated event');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully!',
      recruitment 
    });
  } catch (err) {
    console.error('Error submitting response:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get all recruitments (optionally filter by org)
export const getRecruitments = async (req, res) => {
  try {
    const { orgId } = req.query;
    const filter = orgId ? { orgId } : {};
    const recruitments = await Recruitment.find(filter)
      .populate('orgId', 'username profilepic')
      .populate('responses.gamerId', 'username profilepic');
    return res.status(200).json({ success: true, recruitments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get responses for a specific recruitment (for orgs)
export const getRecruitmentResponses = async (req, res) => {
  try {
    const { recruitmentId } = req.params;
    const orgId = req.id; // Current user (org)

    console.log('Fetching responses for recruitment:', { recruitmentId, orgId });

    const recruitment = await Recruitment.findOne({ _id: recruitmentId, orgId })
      .populate('orgId', 'username profilepic')
      .populate('responses.gamerId', 'username profilepic bio location');

    if (!recruitment) {
      console.log('Recruitment not found or access denied for org:', orgId);
      return res.status(404).json({ success: false, message: 'Recruitment not found or access denied.' });
    }

    console.log('Found recruitment with responses:', { 
      game: recruitment.game, 
      responseCount: recruitment.responses.length 
    });

    return res.status(200).json({ 
      success: true, 
      recruitment,
      responses: recruitment.responses 
    });
  } catch (err) {
    console.error('Error getting recruitment responses:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}; 

// Close a recruitment (stop responses)
export const closeRecruitment = async (req, res) => {
  try {
    const { recruitmentId } = req.params;
    const orgId = req.id; // Authenticated org user

    // Find the recruitment and ensure the org owns it
    const recruitment = await Recruitment.findOne({ _id: recruitmentId, orgId });
    if (!recruitment) {
      return res.status(404).json({ success: false, message: 'Recruitment not found or access denied.' });
    }
    if (!recruitment.isOpen) {
      return res.status(400).json({ success: false, message: 'Recruitment is already closed.' });
    }
    recruitment.isOpen = false;
    await recruitment.save();

    // Remove notifications related to this recruitment
    await removeRecruitmentNotifications(recruitment);

    // Emit socket event for recruitment closed
    const io = req.app.get('io');
    if (io) {
      console.log('Emitting recruitment_closed event:', { recruitmentId: recruitment._id });
      io.emit('recruitment_closed', { recruitment });
    } else {
      console.log('Socket.io not available for recruitment_closed event');
    }

    return res.status(200).json({ success: true, message: 'Recruitment closed and notifications removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}; 