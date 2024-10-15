import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const UploadProductImages = () => {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor('productImages', 10, { // Field name 'productImages' harus sesuai dengan yang ada di Postman
        storage: diskStorage({
          destination: './uploads/product-images',
          filename: (req, file, callback) => {
            const randomName = uuidv4() + extname(file.originalname);
            callback(null, randomName);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|jfif)$/)) {
            return callback(new Error('Unsupported file type'), false);
          }
          callback(null, true);
        },
        // limits: {
        //     fields: 10,
        //     files: 10
        // }
      }),
    ),
  );
};
