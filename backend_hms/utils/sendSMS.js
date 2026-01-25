const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;
const toPhone = process.env.ADMIN_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: fromPhone,
      to: toPhone,
    });

    console.log('SMS sent successfully:', response.sid);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendSMS;
