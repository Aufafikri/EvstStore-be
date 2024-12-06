import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    public async createProduct(createProductDto: CreateProductDto, merchantId: string, imagePaths: string[]) {
        // try {
        //     const { category, ...productData } = createProductDto;

        //     let existingCategory = await this.prisma.category.findUnique({
        //       where: { name: category.name },
        //     });
        
        //     if (!existingCategory) {
        //       existingCategory = await this.prisma.category.create({
        //         data: {
        //           name: category.name,
        //           label: category.label,
        //           type: category.type,
        //           size: category.size,
        //           brand: category.brand,
        //           description: category.description,
        //         },
        //       });
        //     }

        //     return await this.prisma.product.create({
        //       data: {
        //         ...productData,
        //         merchantId: merchantId,
        //         categoryId: existingCategory.id,
        //         image: imagePaths,
        //       },
        //     });
        //   } catch (error) {
        //     console.error('Error creating product:', error);
        //     throw new Error('Failed to create product');
        //   }
        try {
          // Ekstrak kategori dari createProductDto
          const categoryData = {
              name: createProductDto['category.name'],
              label: createProductDto['category.label'],
              type: createProductDto['category.type'],
              size: createProductDto['category.size'],
              description: createProductDto['category.description'],
          };

          const productData = {
              name: createProductDto.name,
              price: Number(createProductDto.price),  // Konversi price ke integer
              description: createProductDto.description,
              stock: Number(createProductDto.stock),  // Konversi stock ke integer
          };

          let existingCategory = await this.prisma.category.findUnique({
              where: { name: categoryData.name },
          });
          
          if (!existingCategory) {
              existingCategory = await this.prisma.category.create({
                  data: categoryData,
              });
          }

          return await this.prisma.product.create({
              data: {
                  ...productData,
                  merchantId: merchantId,
                  categoryId: existingCategory.id,
                  image: imagePaths,
              },
          });
      } catch (error) {
          console.error('Error creating product:', error);
          throw new Error('Failed to create product');
      }
    }

    public async getAllProducts() {
        return this.prisma.product.findMany({
            include: {
                Category: true
            }
        })
    }

    public async getProductById(productId: string) {
        return this.prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                Merchant: true
            }
        })
    }
}
