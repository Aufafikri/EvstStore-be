import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { GetProductsDto } from './dto/get-products-category.dto';

// @SkipThrottle()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Throttle({ default: { limit: 3, ttl: 10000 } })
  @Get()
  @UseInterceptors(GetAllProductsInterceptor)
  public async getAllProducts() {
    return this.productsService.getAllProducts()
  }

  @Get('/category')
  public async getProductsByCategories(@Query() query: GetProductsDto) {
    return this.productsService.getProductsByCategories(query)
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
  ) {
    return this.productsService.createProduct(
      createProductDto,
      merchantId,
    );
  }
}