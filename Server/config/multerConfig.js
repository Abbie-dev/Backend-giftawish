import multer from 'multer';
import path from 'path';

//multer storage configuration
// Define __dirname when running the script with node
const __dirname = path.resolve();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/uploads'));
  },
  filename: (req, file, cb) => {
    const userId = req.params.id;
    const extension = path.extname(file.originalname)
    const newFilename = `profile_${userId}${extension}`
    cb(null, newFilename);
  },
});

//create the multer upload instance

const upload = multer({ storage });

const uploadProfileImage = upload.single('profileImage');

export default uploadProfileImage;
