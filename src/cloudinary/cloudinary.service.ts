import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // public async uploadImage(filePath: string) {
  //   try {
  //     const result = await cloudinary.uploader.upload(filePath, {
  //       folder: 'avatars',
  //     });
  //     return result;
  //   } catch (error) {
  //     throw new Error("image can't be uploaded");
  //   } finally {
  //     fs.unlinkSync(filePath);
  //   }
  // }

  public async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Kirim buffer dari multer ke cloudinary
      const stream = Readable.from(file.buffer);
      stream.pipe(upload);
    });
  }
}
