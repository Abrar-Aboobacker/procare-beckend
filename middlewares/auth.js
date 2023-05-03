const jwt = require("jsonwebtoken");

(module.exports.userjwt = async (req, res, next) => {
  try {
    const usertoken = req.headers["authorization"]?.split(" ")[1];
    if (!usertoken) {
      res.send({ status: "failed", message: "You need token ok" });
    } else {
      jwt.verify(usertoken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          // console.log(err);
          res
            .status(401)
            .send({ message: "user Auth Failed", success: false });
        } else {  
          req.userId = decoded.userId;
          next();
        }
      });
    }
  } catch (error) {
    console.log("hyyyyy");
    return res.status(401).send({
      message: "Auth failed ayi",
      success: false,
    });
  }
});

(module.exports.adminjwt = async (req, res, next) => {
  try {
    const admintoken = req.headers["authorization"]?.split(" ")[1];
    if (!admintoken) {
      res.send({ status: "failed", message: "You need token ok" });
    } else {
      jwt.verify(admintoken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log(err);
          res
            .status(401)
            .send({ message: "admin Auth Failed", success: false });
        } else {
          
          req.adminId = decoded.adminId;
          next();
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "Auth failed ayi",
      success: false,
    });
  }
});

  (module.exports.doctorjwt = async (req, res, next) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        res.send({ status: "failed", message: "You need token ok" });
      } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
          
            console.log(err);
            res
              .status(401)
              .send({ message: "Doctor Auth Failed", success: false });
          } else {
            
            req.doctorId = decoded.doctorId;
            next();
          }
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).send({
        message: "Auth failed ayi",
        success: false,
      });
    }
  });
  (module.exports.doctorwaitingjwt = async (req, res, next) => {
    try {
      
      const doctorwaitingtoken = req.headers["authorization"]?.split(" ")[1];
      
      if (!doctorwaitingtoken) {
       
        res.send({ status: "failed", message: "You need token ok" });
      } else {
        
        jwt.verify(doctorwaitingtoken, process.env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
            console.log(err);
            res
              .status(401)
              .send({ message: "Doctor Auth Failed", success: false });
          } else {
            req.doctorId = decoded.doctorwaitingId;
            next();
          }
        });
      }
    } catch (error) {
      console.log('ithanoooooooooooooooooooo');
      console.log(error);
      return res.status(401).send({
        message: "Auth failed ayi",
        success: false,
      });
    }
  });