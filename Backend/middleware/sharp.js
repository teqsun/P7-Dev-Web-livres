const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
            

const optimizeImage = (req, res, next) => {

  
    if (!req.file) return next();

  
    const imageInput = req.file.path;
    const imageOutput = req.file.path.replace(/\.(jpg|jpeg|png)$/, ".webp");

    sharp(imageInput)
    .resize(400)
    .toFormat('webp')
    .toFile(imageOutput)
    .then(() => {
      fs.unlinkSync(imageInput);
      req.file.path = imageOutput;
      req.file.mimetype = 'image/webp';
      req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');
      next();
    })
    .catch((error) => {
      console.error("Erreur lors de la modification de l'image :", error);
      next();
    });
};

module.exports = optimizeImage;