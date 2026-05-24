const User = require('../models/User');
const NotificationLog = require('../models/NotificationLog');

/**
 * Sends an SMS to a user via Twilio REST API and logs the result.
 * 
 * @param {string} userId - Mongoose User ID
 * @param {string} type - Notification type ('diet_plan', 'appointment_confirmation', 'appointment_reminder')
 * @param {string} recipient - Recipient phone number in E.164 format (e.g. '+917983520752')
 * @param {string} content - Message text
 */
exports.sendSMS = async (userId, type, recipient, content) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  console.log(`[SMS Service] Preparing to send ${type} SMS to ${recipient}`);

  // Fetch user preferences
  let smsEnabled = false;
  try {
    const user = await User.findById(userId);
    if (user) {
      smsEnabled = user.notificationPreferences?.smsEnabled;
      
      // If user has specific categories disabled, respect that
      if (type === 'diet_plan' && user.notificationPreferences?.categories?.dietPlans === false) {
        console.log(`[SMS Service] Diet Plan SMS category is disabled for user ${userId}. Skipping.`);
        return;
      }
      if ((type === 'appointment_confirmation' || type === 'appointment_reminder') && 
          user.notificationPreferences?.categories?.appointments === false) {
        console.log(`[SMS Service] Appointments SMS category is disabled for user ${userId}. Skipping.`);
        return;
      }
    }
  } catch (err) {
    console.error(`[SMS Service] Error checking user preferences for ${userId}:`, err.message);
  }

  if (!smsEnabled) {
    console.log(`[SMS Service] SMS notifications are disabled (strictly opt-in) for user ${userId}. Skipping dispatch.`);
    return;
  }

  // Dry run fallback if Twilio credentials are not set
  if (!accountSid || !authToken || !fromNumber) {
    console.warn('[SMS Service] Twilio credentials missing in environment variables. Logging message in Dry Run mode.');
    
    // Log dry-run as failed/simulated or sent
    await NotificationLog.create({
      userId,
      channel: 'sms',
      type,
      recipient,
      content,
      status: 'failed',
      error: 'Twilio credentials missing. Dry-run triggered.'
    });
    return;
  }

  try {
    const cleanRecipient = recipient.replace(/\s+/g, ''); // Strip whitespace from phone number
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const bodyParams = new URLSearchParams();
    bodyParams.append('To', cleanRecipient);
    bodyParams.append('From', fromNumber);
    bodyParams.append('Body', content);

    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams.toString()
    });

    const resData = await response.json();

    if (response.ok) {
      console.log(`[SMS Service] SMS sent successfully. Twilio SID: ${resData.sid}`);
      
      // Save notification log
      await NotificationLog.create({
        userId,
        channel: 'sms',
        type,
        recipient: cleanRecipient,
        content,
        status: 'sent',
        twilioSid: resData.sid
      });
      return { success: true, sid: resData.sid };
    } else {
      console.error(`[SMS Service] Twilio API Error: ${resData.message || response.statusText}`);
      
      await NotificationLog.create({
        userId,
        channel: 'sms',
        type,
        recipient: cleanRecipient,
        content,
        status: 'failed',
        error: resData.message || `Twilio error status ${response.status}`
      });
      return { success: false, error: resData.message };
    }
  } catch (error) {
    console.error(`[SMS Service] Dispatch exception:`, error.message);
    
    await NotificationLog.create({
      userId,
      channel: 'sms',
      type,
      recipient,
      content,
      status: 'failed',
      error: error.message
    });
    return { success: false, error: error.message };
  }
};
