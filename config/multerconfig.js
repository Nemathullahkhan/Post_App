const multer = require("multer");
// we need two things to use multer 
const path = require("path");
const crypto = require("crypto");

//diskstorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads') // directory to save the file
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12,function(err,name){
        const fn = name.toString("hex")+path.extname(file.originalname); // generate a unique filename
        cb(null, fn)
      })
    }
  })
  
  const upload = multer({ storage: storage })

  //exporting the upload variable 
  module.exports = upload;