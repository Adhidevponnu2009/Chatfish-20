import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { order } = req.body;

    try {
      await sendgrid.send({
        to: process.env.TO_EMAIL,          // Your email
        from: process.env.FROM_EMAIL,      // Verified sender
        subject: `New Order: ${order.id}`,
        text: `New order received!\n
Customer: ${order.customer.name}\n
Phone: ${order.customer.phone}\n
Address: ${order.customer.location}\n
Total: ₹${order.total}\n
Items: ${order.items.map(i => `${i.name} x${i.qty} = ₹${i.price*i.qty}`).join('\n')}`,
        html: `<h3>New order received!</h3>
<p><strong>Customer:</strong> ${order.customer.name}</p>
<p><strong>Phone:</strong> ${order.customer.phone}</p>
<p><strong>Address:</strong> ${order.customer.location}</p>
<p><strong>Total:</strong> ₹${order.total}</p>
<p><strong>Items:</strong></p>
<ul>${order.items.map(i => `<li>${i.name} x${i.qty} = ₹${i.price*i.qty}</li>`).join('')}</ul>`
      });

      return res.status(200).json({ message: 'Email notification sent!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}