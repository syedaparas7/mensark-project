import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { formData, cartItems, amount, method } = req.body;

  // ✅ 1. Whitelist allowed methods to prevent injection
  const allowedMethods = ['card', 'easypaisa', 'jazzcash'];
  if (!allowedMethods.includes(method)) {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  // ✅ 2. Validate input fields
  if (!formData?.email || !amount || !cartItems?.length) {
    return res.status(400).json({ error: 'Missing required payment information' });
  }

  try {
    const PAYFAST_API_KEY = process.env.PAYFAST_API_KEY;
    const PAYFAST_API_SECRET = process.env.PAYFAST_API_SECRET;

    // ✅ 3. Send secure server-to-server POST request
    const response = await axios.post(
      `https://sandbox.payfast.pk/${method}-checkout`,
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        cartItems,
        amount,
        paymentMethod,
        paymentStatus,
        status: 'Order Placed',
        createdAt: serverTimestamp(),
      },
      {
        headers: {
          'x-api-key': PAYFAST_API_KEY,
          'x-api-secret': PAYFAST_API_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    // ✅ 4. Safely extract redirect URL
    const redirectUrl = response.data?.redirectUrl || response.data?.data?.checkout_url;
    if (!redirectUrl) {
      return res.status(500).json({ error: 'Missing redirect URL from PayFast' });
    }

    return res.status(200).json({ redirectUrl });

  } catch (err) {
    console.error(`${method} checkout error:`, err.response?.data || err.message);
    return res.status(500).json({ error: 'Payment redirect failed' });
  }
}
