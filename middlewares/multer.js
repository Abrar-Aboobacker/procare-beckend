const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    let uploadPath = '';
      uploadPath = path.join('public','uploads', 'certificate');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

function handleUpload(fieldname){
   return function (req,res,next) {
    upload.single(fieldname)(req,res,(err)=>{
      if(err){
        console.log(err);
        return res.status(500).json({ messge: "Something gone wrong"});
      }
      next()
    })
   }
}

module.exports = {handleUpload:handleUpload}