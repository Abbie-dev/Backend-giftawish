import multer from 'multer';
import path from 'path';

//multer storage configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

//create the multer upload instance

const upload = multer({ storage });

const uploadProfileImage = upload.single('profileImage');

export default uploadProfileImage;
