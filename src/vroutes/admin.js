const { isAdmin, isDoctorOrAdmin, isLoggedIn } = require('../middlewares/roleValidation')

const PatientAppointments = require('./../models/Patient/patientAppointments')
const PatientProfile = require('./../models/Patient/patientProfile')
const Counsellors = require('./../models/counsellors')

const router = require('express').Router()

router.use(isLoggedIn)


router.get('/', isAdmin, async(req, res) => {
    try {
        return res.render('admin/dashboard', {
            user: req.user,
            role: req.user.role
        })
    } catch (error) {
        
    }
})

router.get('/all-appointments', async(req, res) => {
    try {
        console.log(req.user)
        if(req.user.role == 'doctor'){
            return res.redirect('/admin/my-appointments')
        }
        const patientAppointments = await PatientAppointments.find({})
        return res.render('admin/appointments', {
            user: req.user,
            role: req.user.role,
            appointments: patientAppointments
        })
    } catch (error) {
        console.log(error)
        console.log("going to error")
        return res.send("Error")
    }
})



router.get('/my-appointments', isDoctorOrAdmin, async(req, res) => {
    try {
        let appointments = []
        const doctorNumber = req.user.phoneNumber;
        const doctor = await Counsellors.findOne({ phoneNumber: doctorNumber })
        if(doctor){
            appointments = await PatientAppointments.find({ doctorId: doctor.id })
        }
        return res.render('admin/appointments', {
            user: req.user,
            role: 'admin',
            appointments
        })
    } catch (error) {
        console.log(error)
        console.log("going to error")
        return res.send("Error")
    }
})



router.get('/all-doctors', isAdmin, async(req, res) => {
    try {
        let doctors = []
        const listOfDoctors = await Counsellors.find({ })
        return res.render('admin/doctors', {
            role: req.user.role,
            user: req.user,
            doctors: listOfDoctors
        })
    } catch (error) {
        console.log(error)
        console.log("going to error")
        return res.send("Error")
    }
})




router.get('/doctor-profile/:id', isDoctorOrAdmin, async(req, res) => {
    try {
        
    } catch (error) {
        
    }
})


router.get('/new-doctor', isAdmin, async(req, res) => {
    try {
        return res.render('admin/new-doctor', {
            user: req.user,
            role: req.user.role, 
        })
    } catch (error) {
        
    }
}) 


module.exports =router;
