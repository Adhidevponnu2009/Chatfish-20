import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderDetails } = req.body;

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Email options
    const mailOptions = {
      from: `"ChatFish Orders" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // send to yourself
      subject: `New Order Received - ${orderDetails.id}`,
      text: `
New order received!

Customer: ${orderDetails.customer.name}
Phone: ${orderDetails.customer.phone}
Address: ${orderDetails.customer.location}

Items:
${orderDetails.items.map(i => `${i.name} x${i.qty} = ₹${i.price*i.qty}`).join('\n')}

Total: ₹${orderDetails.total}
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email notification sent!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
