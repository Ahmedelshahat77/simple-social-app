import multer from "multer";

export const validationObject = {
  image: ["image/png", "image/jpeg"],
  file: ["application/pdf"],
};

export const myMulter = ({
  customValidation = validationObject.image,
} = {}) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("in-valid extension", { cause: 400 }), false);
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};
