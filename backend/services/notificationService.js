const NotificationLog = require('../models/NotificationLog');

// Hardcoded recipient as requested
const HARDCODED_RECIPIENT = '+917983520752';

/**
 * Sends an SMS via Twilio REST API and logs the result.
 * All messages are sent to a single hardcoded number per owner's request.
 * @param {string} userId - Mongoose User ID (kept for logging)
 * @param {string} type - Notification type
 * @param {string} _recipient - Ignored; recipient overridden
 * @param {string} content - Message text
 */
exports.sendSMS = async (userId, type, _recipient, content) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  const recipient = HARDCODED_RECIPIENT;
  console.log(`[SMS Service] Overriding recipient and sending ${type} SMS to ${recipient}`);

  // Dry run fallback if Twilio credentials are not set
  if (!accountSid || !authToken || !fromNumber) {
    console.warn('[SMS Service] Twilio credentials missing in environment variables. Logging message in Dry Run mode.');
    await NotificationLog.create({
      userId,
      channel: 'sms',
      type,
      recipient,
      content,
      status: 'failed',
      error: 'Twilio credentials missing. Dry-run triggered.'
    });
    return { success: false, error: 'Twilio credentials missing' };
  }

  try {
    const cleanRecipient = recipient.replace(/\s+/g, '');
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
