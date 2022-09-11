const PatientUser = require('./../models/Patient/patientLogin')
const PatientProfile = require('./../models/Patient/patientProfile')
const UserOtp = require('./../models/userOtp')

const bcrypt = require('bcrypt')
const generateToken = require('./../services/generateToken')
const generateOtp = require('../services/generateOtp')
const { sendOTP } = require('./../services/sendOtp')
const { detectValidJwt } = require('../services/detectValidJwt')
const patientLogin = require('./../models/Patient/patientLogin')


const checkLoggedIn = async(req, res) => {
    try {
        const loggedIn = detectValidJwt(req)
        return res.status(200).json({
            loggedIn
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

const loginSendOtp = async(req, res) => {
    try {
        let otp = generateOtp(6);
        const userNum = req.body.userNum;
        console.log(req.body)
        console.log("Sending OTP to "+userNum+" : " + otp);
        const userExist = await PatientUser.findOne({ phoneNumber: userNum })

        if(userExist){
            const otpExist = await UserOtp.findOne({
                phoneNumber: userNum
            })
            req.data = {
                otp,
                phoneNumber: userNum
            }
            if(otpExist){
                const savedUserOtp = await UserOtp.findOneAndUpdate(
                    {
                        phoneNumber: userNum
                    },
                    {
                        $set: {
                            otp
                        },
                    },
                    {
                        new: true
                    }
                )
                const info = await sendOTP(userNum, otp)
                
                console.log(info)
                return res.json({
                    code: 200,
                    status: "OTP Resent!"
                })
            }
            const info = await sendOTP(userNum, otp)
            const newUserOtp = new UserOtp({
                otp,
                phoneNumber: userNum
            })
            const savedNewUserOtp = await newUserOtp.save();
            return res.json({
                code: 200,
                status: 'otp Sent',
                message: "User Already Exists"
            })
        } else {
            console.log("Creating new user!");
            console.log(userNum)
            const newPatient = new PatientUser({
                // name: req.body.name,
                phoneNumber: userNum
            })
            const newPatientProfile = new PatientProfile({
                name: req.body.name,
                phoneNumber: userNum
            })
            const newUserOtp =new UserOtp({
                otp,
                phoneNumber: userNum
            });
            const info = await sendOTP(userNum, otp)

    
            await newPatient.save()
            await newPatientProfile.save()
            await newUserOtp.save()

            return res.json({
                code: 200,
                status: 'OTP Send',
                message: 'New User Registered!'
            })
            
        }

        // const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // const newPatient = new PatientUser({
        //     name: req.body.name,
        //     password: hashedPassword,
        //     phoneNumber: req.body.phoneNumber
        // })
        
        // const newPatientProfile = new PatientProfile({
        //     name: req.body.name,
        //     phoneNumber: req.body.phoneNumber
        // })

        // await newPatient.save()
        // await newPatientProfile.save()

        // return res.status(200).json({
        //     message: "New Patient Registered!"
        // })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ code: 500, error })
    }
}


const verifyOtp = async(req, res) => {
    try {
        const userOtp = req.body.otp;
        const phoneNumber = req.body.userNum;

        const UserAuthOtp = await UserOtp.findOne({ phoneNumber })
        if(!UserAuthOtp){
            console.log("OTP not found!")
            return res.status(500).json({
                code: 500,
                status: 500,
                message: "OTP Not Found"
            })
        }

        if(userOtp == UserAuthOtp.otp){
            await UserAuthOtp.deleteOne({ phoneNumber})
            // const patientLogin = await PatientLogin.findOne({ phoneNumber })
            const patientUser = await PatientUser.findOne({ phoneNumber })
            const token = await generateToken(patientUser);
            return res.json({
                code: 200, 
                status: 200,
                AuthToken: token
            })

        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}


module.exports = {
    loginSendOtp,
    verifyOtp,
    checkLoggedIn
}