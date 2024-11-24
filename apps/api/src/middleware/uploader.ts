import path from 'path';
import multer from 'multer';
import { Request } from 'express';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const uploader = (filePrefix: string, folderName?: string) => {
  const defaultDir = path.join(__dirname, '../../public');

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedMimeTypes.includes(file.mimetype))
      throw new Error('Invalid file type');
    cb(null, true);
  };

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback,
    ) => {
      const destination = folderName
        ? path.join(defaultDir, folderName)
        : defaultDir;
      cb(null, destination);
    },

    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback,
    ) => {
      const originalNameParts = file.originalname.split('.');
      const fileExtension = originalNameParts[originalNameParts.length - 1];
      const newFileName = filePrefix + Date.now() + '.' + fileExtension;
      cb(null, newFileName);
    },
  });

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1 * 1024 * 1024,
    },
  });
};
