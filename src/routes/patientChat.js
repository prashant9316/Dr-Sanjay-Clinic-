const { getChatIdByAppointmentId, getUserChatById } = require('../controllers/patientChatController')

const router = require('express').Router()

router.get('/:id', getUserChatById)

router.post('/:id', getChatIdByAppointmentId)

router.post('/get-user-chats-by-roomid/:id', getUserChatById)


module.exports = router;
