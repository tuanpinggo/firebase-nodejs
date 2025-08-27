const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); 

app.use(bodyParser.json());
app.use(cors());
// Khởi tạo Firebase Admin
const serviceAccount = require('./fcm-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Route gửi FCM
app.post('/send', async (req, res) => {
  const { token, title, body, data } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: 'Missing token, title, or body' });
  }

  const message = {
    notification: {
      title,
      body
    },
    token,
    data: data || {}
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message', details: error });
  }
});

const PORT = process.env.PORT || 8098;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
