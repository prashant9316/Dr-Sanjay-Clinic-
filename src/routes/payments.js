const shortid = require('shortid');
const PatietnAppointments = require('./../models/Patient/patientAppointments')
const Razorpay = require('razorpay'); 
const patientAppointments = require('./../models/Patient/patientAppointments');

const router = require('express').Router()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


router.post('/fetch-razorpay-patient-details', async(req, res) => {
    try {
        const appointmentId = req.body.appointmentId;

        const appointmentDetails = await PatietnAppointments.findOne({ appointmentId })
        if(appointmentDetails.orderId!= null){
            return res.json({
                id: appointmentDetails.orderId,
                currency: 'INR',
                amount: (appointmentDetails.fees * 100)
            })
        }

        const amount = appointmentDetails.fees;
        const currency = 'INR'

        const options = {
            amount: (amount*100).toString(),
            currency,
            receipt: shortid.generate()
        }

        const response = await razorpay.orders.create(options);
        const updateAppointmentDetails = await patientAppointments.findOneAndUpdate(
            { appointmentId },
            {$set: {
                orderId: response.id,
                receipt_id: response.receipt
            }},
            {
                new: true
            }
        )
        return res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        })

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            error
        })
    }
})


router.post('/razorypay-verification', async(req, res) => {
    try {
        const crypto = require('crypto')
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest('hex')
        if(req.headers['x-razorpay-signature'] == digest){
            order = req.body.payload.payment.entity;
            console.log("Payment Successfull!");
            console.log(order);
            await patientAppointments.findOneAndUpdate(
                { orderId: order.order_id},
                {
                    $set: {
                        paymentId: order.id,
                        paymentStatus: true
                    }
                }
            )
        }
        console.log("Done")
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;