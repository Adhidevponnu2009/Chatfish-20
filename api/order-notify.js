// api/notify.js
import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;           // Twilio Account SID from Vercel env
const authToken = process.env.TWILIO_AUTH_TOKEN;    // Twilio Auth Token from Vercel env
const fromNumber = process.env.TWILIO_PHONE;        // Your Twilio phone number
const toNumber = process.env.MY_PHONE_NUMBER;       // Your mobile number to receive SMS

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderDetails } = req.body;

    if (!orderDetails) {
      return res.status(400).json({ error: "Order details are missing" });
    }

    try {
      // Send SMS
      await client.messages.create({
        body: `📦 New order received!\nCustomer: ${orderDetails.customer.name}\nPhone: ${orderDetails.customer.phone}\nAddress: ${orderDetails.customer.location}\nTotal: ₹${orderDetails.total}\nItems: ${orderDetails.items.map(i => `${i.name} x${i.qty}`).join(', ')}`,
        from: fromNumber,
        to: toNumber
      });

      return res.status(200).json({ message: 'Notification sent via SMS!' });
    } catch (error) {
      console.error("Twilio error:", error);
      return res.status(500).json({ error: 'Failed to send notification' });
    }

  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
  }
}
