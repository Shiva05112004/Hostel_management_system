const twilio = require('twilio');
const accountSid = 'YOUR_TWILIO_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = new twilio(accountSid, authToken);

exports.sendSMS = async (req, res) => {
  const { message, to } = req.body;
  try {
    const result = await client.messages.create({
      body: message,
      from: 'YOUR_TWILIO_PHONE',
      to: to
    });
    res.status(200).json({ success: true, sid: result.sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
