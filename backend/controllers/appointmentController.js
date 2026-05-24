const Appointment = require('../models/Appointment');
const Expert = require('../models/Expert');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

// @desc    Book an appointment with an expert
// @route   POST /api/appointments
// @access  Private
exports.bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expertId, dateTime, notes } = req.body;

    if (!expertId || !dateTime) {
      return res.status(400).json({ success: false, message: 'Please provide expertId and dateTime' });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    const appointment = new Appointment({
      userId,
      expertId,
      dateTime: new Date(dateTime),
      notes
    });

    await appointment.save();

    // Trigger confirmation SMS if user has a phone set and preferences enabled
    const user = await User.findById(userId);
    if (user && user.phone) {
      const formattedDate = new Date(dateTime).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      const smsContent = `Hi ${user.name}! Your appointment with ${expert.name} has been scheduled for ${formattedDate}. Thank you!`;
      
      // Dispatch async to avoid blocking response
      notificationService.sendSMS(userId, 'appointment_confirmation', user.phone, smsContent)
        .catch(err => console.error('[Appointment Controller] Conf SMS dispatch error:', err.message));
    }

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error('[Appointment Controller] Booking Error:', error);
    res.status(500).json({ success: false, message: 'Failed to book appointment', error: error.message });
  }
};

// @desc    Get current user's appointments
// @route   GET /api/appointments/mine
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ userId })
      .populate('expertId', 'name specialty credentials')
      .sort({ dateTime: 1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('[Appointment Controller] Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching appointments' });
  }
};

/**
 * Periodically checks for upcoming appointments and sends reminder SMS alerts.
 * Designed to run every 5 minutes in server.js.
 */
exports.startReminderScheduler = () => {
  console.log('[Scheduler] Appointment reminder scheduler initialized (checking every 5 minutes).');
  
  setInterval(async () => {
    try {
      const now = new Date();
      // Target appointments within the next 2 hours
      const twoHoursLimit = new Date(Date.now() + 2 * 60 * 60 * 1000);
      
      const upcomingAppointments = await Appointment.find({
        status: 'scheduled',
        reminderSent: false,
        dateTime: { $gt: now, $lte: twoHoursLimit }
      });

      if (upcomingAppointments.length > 0) {
        console.log(`[Scheduler] Found ${upcomingAppointments.length} upcoming appointments needing reminders.`);
        
        for (const appointment of upcomingAppointments) {
          const user = await User.findById(appointment.userId);
          const expert = await Expert.findById(appointment.expertId);
          
          if (user && user.phone) {
            const formattedTime = new Date(appointment.dateTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });
            const smsContent = `Reminder: You have a scheduled session with ${expert ? expert.name : 'your expert'} today at ${formattedTime} (in less than 2 hours).`;
            
            await notificationService.sendSMS(appointment.userId, 'appointment_reminder', user.phone, smsContent);
          }
          
          // Mark as sent regardless of Twilio success, to prevent multiple attempts
          appointment.reminderSent = true;
          await appointment.save();
        }
      }
    } catch (error) {
      console.error('[Scheduler] Error running upcoming appointment reminder checks:', error.message);
    }
  }, 5 * 60 * 1000); // 5 minutes
};
