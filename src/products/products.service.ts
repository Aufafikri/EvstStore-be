import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products-category.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    public async createProduct(createProductDto: CreateProductDto, merchantId: string) {
        try {
            const { category, description, name, price, stock } = createProductDto

            return this.prisma.product.create({
                data: {
                    name: name,
                    description: description,
                    price: price,
                    stock: stock,
                    Category: {
                        create: {
                            ...category
                        }
                    },
                    Merchant: {
                        connect: {
                            id: merchantId
                        }
                    }
                }
            })
        } catch (error) {
            throw new Error 
        }
    }

    public async getAllProducts() {
        return this.prisma.product.findMany({
            include: {
                Category: true
            }
        })
    }

    public async getProductsByCategories(query: GetProductsDto) {
        const { category } = query

        return this.prisma.product.findMany({
            where: category ? {
                Category: {
                    name: category
                }
            } : {},
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
