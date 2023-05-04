const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    let uploadPath = '';
    // if(file.fieldname === 'file'){
      // uploadPath = path.join('public','uploads', 'certificate');
    // }else{
      uploadPath = path.join('public','uploads', 'profile');
    // }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

function handleUpload(fieldname){
   return function (req,res,next) {
    console.log(fieldname);
    upload.single(fieldname)(req,res,(err)=>{
      if(err){
        console.log(err);
        return res.status(500).json({ message: "Something gone wrong"});
      }
      next()
    })
   }
}

module.exports = {handleUpload:handleUpload}