const { getAllAppointments, bookNewAppointment } = require('../controllers/patientAppointmentController')
const { isPatient, isLoggedIn } = require('../middlewares/roleValidation')

const router = require('express').Router()



router.post('/all-appointments', isLoggedIn, isPatient, getAllAppointments)
router.post('/new-appointment', bookNewAppointment)

module.exports = router;