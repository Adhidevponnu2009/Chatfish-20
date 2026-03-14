import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;AC89a3f23623e006fef8815ce739ab8c53      // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;CMPMKYY36KD74Z15QK2SM443// Twilio Auth Token
const fromNumber = process.env.TWILIO_PHONE;+14155238886    // Twilio phone number
const toNumber = process.env.MY_PHONE_NUMBER;+91 9656963001   // Your phone number

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderDetails } = req.body;

    try {
      await client.messages.create({
        body: `New order received! Details: ${JSON.stringify(orderDetails)}`,
        from: fromNumber,
        to: toNumber
      });

      return res.status(200).json({ message: 'Notification sent!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send notification' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
