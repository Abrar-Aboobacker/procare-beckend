const serviceid = process.env.Service_SID;
const sid = process.env.Account_SID;
const token = process.env.Auth_Token;
const client = require('twilio')(sid, token);


function sendOtp(mobile){


 client.verify.v2.services(serviceid)
                .verifications
                .create({to:`+91${mobile}`, channel: 'sms'})
                .then(verification => console.log(verification.status));

}

function verifyOtp(mobile,otp){
    return new Promise((resolve,reject)=>{
        client.verify.v2.services(serviceid)
      .verificationChecks
      .create({to: `+91${mobile}`, code: otp})
      .then((verification_check) =>{ console.log(verification_check.status)
      resolve(verification_check)
    });
    }).catch((verification_check) =>{ console.log(verification_check.status)
        resolve(verification_check)})
}

module.exports = {
    sendOtp,
    verifyOtp
}