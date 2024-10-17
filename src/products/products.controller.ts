import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard'
import { UploadProductImages } from 'src/decorators/uploadProductImage';
import { GetAllProductsInterceptor } from './interceptors/getAll-products.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseInterceptors(GetAllProductsInterceptor)
  public async getAllProducts() {
    return this.productsService.getAllProducts()
  }

  @Get('/:productId')
  public async getProductById(@Param('productId') productId: string ) {
    return this.productsService.getProductById(productId)
  }

  @Post('/:merchantId')
  @UploadProductImages()
  @UseGuards(JwtAuthGuard)
  public async createProduct(
    @Param('merchantId') merchantId: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() productImages: Array<Express.Multer.File>,
  ) {
    console.log('Uploaded Files:', productImages);

    if (!productImages || productImages.length === 0) {
      throw new Error('No files uploaded');
    }

    const imagePaths = productImages.map((image) => `/uploads/product-images/${image.filename}`);
    console.log('Image Paths:', imagePaths);
    console.log('product', createProductDto)
    console.log('merchant', merchantId)
    return this.productsService.createProduct(
      createProductDto,
      merchantId,
      imagePaths,
    );
  }
}