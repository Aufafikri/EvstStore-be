import { applyDecorators, HttpException, HttpStatus, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from 'multer'
import { extname } from "path"
import {v4 as uuidv4} from 'uuid'

export const UploadProfileImage = () => {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor('profileImage', {
                storage: diskStorage({
                    destination: './uploads/profile-images',
                    filename: (req, file, callback) => {
                        const randomName = uuidv4() + extname(file.originalname)
                        callback(null, randomName)
                    }
                }),
                fileFilter: (req, file, callback) => {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|jfif)$/)) {
                      return callback(new Error('Unsupported file type'), false);
                    }
                    callback(null, true);
                  },
                  limits: {
                    files: 10
                  }
            })
        )
    )
}