const { loginSendOtp, verifyOtp, checkLoggedIn } = require('../controllers/patientAuthController');

const router = require('express').Router();

// Routes

router.post('/login', loginSendOtp)
router.post('/verifyotp', verifyOtp)
router.post('/check-login', checkLoggedIn)

module.exports = router