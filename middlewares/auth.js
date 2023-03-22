const jwt = require('jsonwebtoken')

module.exports.userjwt = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        if (!token) {
            res.send({ "status": "failed", "message": "You need token" })
        }else{
            jwt.verify(token,process.env.JWT_SECRET_KET,(err,decoded) => {
                if (err){
                    console.log(err);
                    res.status(401).send({ message:"user Auth Failed",success:false });
                }else{
                    console.log(decoded.userId);
                    req.usrId=decoded.userId;
                    next()
                }
            })
        }
    } catch (error) {
        return res.status(401).send({
             message:"Auth failed",
             success: false,
        })
    }
}
module.exports.adminjwt = async (req, res, next) => {
    try {
        const token = req.headers["x-access-admintoken"]
        if (!token) {
            res.send({ "status": "failed", "message": "You need token" })
        }else{
            jwt.verify(token,process.env.JWT_SECRET_KET,(err,decoded) => {
                if (err){
                    console.log(err);
                    res.status(401).send({ message:"user Auth Failed",success:false });
                }else{
                    console.log(decoded.userId);
                    req.adminId=decoded.id;
                    next()
                }
            })
        }
    } catch (error) {
        return res.status(401).send({
             message:"Auth failed",
             success: false,
        })
    }
}