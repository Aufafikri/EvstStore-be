import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CategoryFilterDto } from './dto/filtered-category.dto';
import { contains } from 'class-validator';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    // public async getCategory () {
    //     return this.prisma.category.findMany({})
    // }

    // public async filteredCategories (filterDto: CategoryFilterDto) {
    //     const { name, brand, size, label, type } = filterDto

    //     return this.prisma.category.findMany({
    //         where: {
    //             name: name ? { contains: name, mode: 'insensitive' } : undefined
    //         }
    //     })
    // }
}
