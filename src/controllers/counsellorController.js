const Counsellors = require('./../models/counsellors')
const PatientUser = require('./../models/Patient/patientLogin')


const getCounsellor = async(req, res) => {
    try {
        const counsellor = await Counsellors.findOne({ id: req.params.id })
        if(!counsellor){
            throw "Counsellor Does Not Exist"
        }
        return res.status(200).json({
            code: 200,
            counsellor
        })
    } catch (error) {
        return res.status(500).json({
            error,
            code: 500
        })
    }
}


const createCounsellor = async(req, res) => {
    try {
        const newCounsellor = new Counsellors({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber
        })
        const newUser = new PatientUser({
            phoneNumber: req.body.phoneNumber,
            role: 'doctor'
        })

        await newCounsellor.save()
        await newUser.save()

        return res.status(200).json({
            code: 200,
            message: "New Counsellor created!"
        })
    } catch (error) {
        return res.status(500).json({
            error,
            code: 500
        })
    }
}


const editCounsellor = async(req, res) => {
    try {
        const counsellor = await Counsellors.findOne({ id: req.params.id })
        if(!counsellor){
            throw "Counsellor Does not exist";
        }
        await Counsellors.findOneAndUpdate({
            id: req.params.id,
        }, {
            $set: req.body
        })
        return res.status(200).json({
            code: 200,
            message: "Updated counsellors details"
        })
    } catch (error) {
        return res.status(500).json({
            error,
            code: 500
        })
    }
}


module.exports = {
    getCounsellor: getCounsellor,
    createCounsellor: createCounsellor,
    editCounsellor: editCounsellor
}