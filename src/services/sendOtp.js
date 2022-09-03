const request = require('request')
const SMS_API_KEY=process.env.SMS_API_KEY

exports.sendOTP = async(phoneNumber, otp) => {
    // let messageBody = `Dear BeSwasth Customer, Your one time password is ${req.data.otp} and valid for 2 mins.`
    // console.log("Message = " + messageBody);
    
    console.log("OTP is: " + otp)
    let number = `+91${phoneNumber}`
    console.log("Number = " + number)
    let subject = "otp"
    console.log("Subject = " + subject);
    let url = `https://2factor.in/API/V1/${SMS_API_KEY}/SMS/${number}/${otp}`
    request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    });
}
