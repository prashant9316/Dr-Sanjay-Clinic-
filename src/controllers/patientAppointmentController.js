const PatientAppointments = require('./../models/Patient/patientAppointments')
const PatientProfile = require('./../models/Patient/patientProfile');
const PatientUser = require('./../models/Patient/patientLogin')
const UserOtp = require('./../models/userOtp')
const { createChat } = require('./patientChatController');
const generateOtp = require('../services/generateOtp');
const { sendOTP } = require('../services/sendOtp');

const fees = 100;

const getAllAppointments = async(req, res) => {
    try {
        const appointments = await PatientAppointments.find({ phoneNumber: req.user.phoneNumber })
        return res.status(200).json({
            appointments
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}


const bookNewAppointment = async(req, res) => {
    try {
        console.log(req.body)
        const phoneNumber = req.body.phoneNumber;

        const userExist = await PatientUser.findOne({ phoneNumber })

        if(userExist){
            const newPatientAppointment = new PatientAppointments({
                patientDetails: {
                    name: req.body.name,
                    id: userExist._id,
                    gender: req.body.gender,
                    phoneNumber,
                    age: req.body.age
                },
                appointmentTime: req.body.appointmentTime,
                doctor: 'Dr Sanjay Kumar',
                patientRemarks: req.body.remarks,
                fees: 100,
            });
            const savedAppointment = await newPatientAppointment.save();
            req.appointment = savedAppointment
            req = await createChat(req)
            return res.status(200).json({
                code: 200,
                message: "New Appointment Booked! Proceeding to payment",
                response: 200
            })
        } else {
            let otp = generateOtp(6);
            console.log("Registering New User!");
            const newPatient = new PatientUser({
                phoneNumber
            })
            const newPatientProfile = new PatientProfile({
                name: req.body.name,
                phoneNumber,
                gender: req.body.gender,
                email: req.body.email,
                age: req.body.age,
                emailId: req.body.email
            })
            // const newUserOtp = new UserOtp({
            //     otp, 
            //     phoneNumber
            // })
            const newPatientAppointment = new PatientAppointments({
                patientDetails: {
                    name: req.body.name,
                    id: newPatient._id,
                    gender: req.body.gender,
                    phoneNumber,
                    age: req.body.age
                },
                appointmentTime: req.body.appointmentTime,
                doctor: 'Dr Sanjay Kumar',
                patientRemarks: req.body.remarks,
                fees: 100,
            });
            await newPatient.save();
            await newPatientProfile.save();
            // await newUserOtp.save();
            const savedAppointment = await newPatientAppointment.save();
            req.appointment = savedAppointment
            console.log(savedAppointment)
            req = await createChat(req)
            // await sendOTP(phoneNumber, otp);
            return res.status(200).json({
                code: 200,
                message: "New User Registered! Appointment Booked!",
                response: 201
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}


module.exports = {
    getAllAppointments, 
    bookNewAppointment
}