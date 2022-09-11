const PatientAppointments = require('./../models/Patient/patientAppointments')
const PatientUser = require('./../models/Patient/patientLogin')
const PatientProfile = require('./../models/Patient/patientProfile')
const Counsellors = require('./../models/counsellors')
const { detectValidJwt } = require('../services/detectValidJwt');
const { isLoggedIn } = require('../middlewares/roleValidation');
const { getChatInfoByChatId } = require('../controllers/patientChatController');

const router = require('express').Router();


router.get('/', isLoggedIn, (req, res) => {
    try {   
        if(req.user.role == 'admin' || req.user.role == 'doctor') {
            return res.redirect('/admin')
        }
        return res.render('index', {
            x: 'index',
            user: req.user
        })
    } catch (error) {
        return res.redirect('/error-page')
    }
})


router.get('/book-appointment', isLoggedIn, async(req, res) => {
    try {
        const listOfDoctors = await Counsellors.find({ })
        let userProfile
        if(req.user._id){
            userProfile = await PatientProfile.findOne({ phoneNumber: req.user.phoneNumber })
            if(!userProfile){
                userProfile = {
                    data: 'something',
                    
                }
            }
            req.user.userProfile = userProfile
        } else {
            userProfile = {
                data: 'something',
            }
            req.user.userProfile = userProfile
        }
        return res.render('book-appointment', {
            x: 'sub',
            doctors: listOfDoctors,
            user: req.user
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/error-page')
    }
})


router.post('/view-appointments', (req, res) => {
    return res.redirect('/view-appointments')
})


router.get('/profile/:id', async(req, res) => {
    try {
        const user = await PatientUser.findOne({ _id: req.params.id })
        const doctor = await Counsellors.findOne({ phoneNumber: user.phoneNumber })
        return res.json({
            userType: user.role,
            userData: doctor
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})


router.get('/view-appointments', isLoggedIn, async (req, res) => {
    try {
        const loggedIN = detectValidJwt(req)
        let appointments = []
        if(!loggedIN){
            return res.render('view-appointments', {
                x: 'sub',
                appointments, 
                code: 404,
                user: req.user
            })
        }
        appointments = await PatientAppointments.find({ phoneNumber: loggedIN.phoneNumber })
        return res.render('view-appointments', {
            x: 'sub',
            appointments,
            code: 200,
            user: req.user
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})


router.get('/appointment-chat/:id', isLoggedIn, async(req, res) => {
    try {
        req = await getChatInfoByChatId(req)
        if(req.error){
            console.log(req.error)
            throw req.error
        }
        return res.render('chat', {
            x: 'sub',
            status: 200,
            chatId: req.data.chatId,
            chatInfo: req.data,
            user: req.user,
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/error-page')
    }
})


router.get('/video-conference/:id', isLoggedIn, (req, res) => {
    try {
        return res.render('meetroom', {
            x: 'sub',
            user: req.user,
            roomid: req.params.id
        })
    } catch (error) {
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})


router.get('/payment-page/:id', isLoggedIn, async(req, res) => {
    try {
        const appointment = await PatientAppointments.findOne({ appointmentId: req.params.id })
        return res.render('payment-page', {
            x: 'sub',
            appointment,
            user: req.user
        })
    } catch (error) {
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})


router.get('/about-us', isLoggedIn, (req, res) => {
    try {
        return res.render('about', {
            x: 'sub',
            user: req.user
        })
    } catch (error) {
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})



router.get('/terms-and-conditions', isLoggedIn, (req, res) => {
    try {
        return res.render('tnc', {
            x: 'sub',
            user: req.user
        })
    } catch (error) {
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})


router.get('/privacy-policy', isLoggedIn, (req, res) => {
    try {
        return res.render('privacy-policy', {
            x: 'sub',
            user: req.user
        })
    } catch (error) {
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})



router.get('/contact-us', isLoggedIn, (req, res) => {
    try {
        return res.render('contact-us', {
            x: 'sub',
            user: req.user
        })
    } catch (error) {
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})

router.get('/error-page', isLoggedIn, (req, res) => {
    try {
        return res.render('error-page', {
            x: 'sub',
            user: req.user
        })
    } catch (error) {
        return res.redirect('/error-page', {
            x: 'sub',
            user: req.user
        })
    }
})

module.exports = router;