import multer from 'multer';

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const allowedResumeTypes = ['application/pdf'];

  if (
    (file.fieldname === 'logo' && allowedImageTypes.includes(file.mimetype)) ||
    (file.fieldname === 'photo' && allowedImageTypes.includes(file.mimetype)) ||
    (file.fieldname === 'resume' && allowedResumeTypes.includes(file.mimetype))
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and PDF allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;