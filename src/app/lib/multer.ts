import path from "node:path";
import multer from "multer";
import { BadRequestError } from "../utils/errorFormats.js";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Only images files are allowed"));
    }
  },
});

export default upload;