import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './lib/prisma.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { MerchantModule } from './merchant/merchant.module';
import { AdminModule } from './admin/admin.module';
import { AddressModule } from './address/address.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { GithubStrategy } from './auth/strategies/github.strategy';
import { TransactionModule } from './transaction/transaction.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
import { CategoriesModule } from './categories/categories.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 0,
      limit: 0
    }]),
    MulterModule.register({
      dest: join(__dirname, '..', 'uploads/profile-images')
    }),
    MulterModule.register({
      dest: join(__dirname, '..', 'uploads/merchant-images')
    }),
    MulterModule.register({
      dest: join(__dirname, '..', 'uploads/product-images')
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    PassportModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    MailModule,
    MerchantModule,
    AdminModule,
    AddressModule,
    TransactionModule,
    CategoriesModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, GoogleStrategy, GithubStrategy, CloudinaryService,{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  exports: [JwtModule]
})
export class AppModule {}
