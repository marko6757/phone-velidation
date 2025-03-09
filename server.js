const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

// Twilio Credentials (store these securely in environment variables in production)
const accountSid = 'ACecbea0a4ddeabe03b4c2953e0e1fd2ac';
const authToken = 'f03c7bcde063c9fa9f6dfdf241929426';  // Replace with your actual auth token
const client = twilio(accountSid, authToken);

// Your Twilio Verify Service SID
const verifyServiceSid = 'VA77f446a158dc970be2156e49b87fa925';

// Endpoint to send a verification code via SMS
app.post('/send-verification', (req, res) => {
    const { phoneNumber } = req.body;

    client.verify.v2.services(verifyServiceSid)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' })
        .then(verification => {
            res.status(200).json({ success: true, sid: verification.sid });
        })
        .catch(error => {
            res.status(500).json({ success: false, error: error.message });
        });
});

// Endpoint to check the verification code provided by the user
app.post('/check-verification', (req, res) => {
    const { phoneNumber, code } = req.body;

    client.verify.v2.services(verifyServiceSid)
        .verificationChecks
        .create({ to: phoneNumber, code: code })
        .then(verificationCheck => {
            if (verificationCheck.status === 'approved') {
                res.status(200).json({ success: true, status: verificationCheck.status });
            } else {
                res.status(400).json({ success: false, status: verificationCheck.status });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, error: error.message });
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// Send verification code
function sendVerification(phoneNumber) {
    return fetch('/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Verification sent:', data.sid);
            return true;
        } else {
            console.error('Error sending verification:', data.error);
            return false;
        }
    })
    .catch(err => {
        console.error(err);
        return false;
    });
}


// Check the verification code
function checkVerification(phoneNumber, code) {
    return fetch('/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Phone number verified!');
            return true;
        } else {
            console.error('Verification failed:', data.status);
            return false;
        }
    })
    .catch(err => {
        console.error(err);
        return false;
    });
}

module.exports = { sendVerification, checkVerification };
