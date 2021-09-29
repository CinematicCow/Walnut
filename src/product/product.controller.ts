import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProductStockDto } from './dto/update-stock.dto';
import { JwtAuthenticationGuard } from 'src/guard/jwt-auth.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCookieAuth()
  @ApiCreatedResponse({ type: Product })
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  @ApiOkResponse({ type: Product, isArray: true })
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @ApiOkResponse({ type: Product })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @ApiCreatedResponse({ type: Boolean })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<boolean> {
    return await this.productService.update(id, updateProductDto);
  }

  @ApiOkResponse({ type: Boolean })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.productService.remove(id);
  }

  @ApiOkResponse({ type: Boolean })
  @Patch('update-stock/:id')
  async updateStock(
    @Param('id') id: string,
    @Query('type') type: string,
    @Body() updateProductStockDto: UpdateProductStockDto,
  ): Promise<boolean> {
    return await this.productService.updateStock(
      id,
      updateProductStockDto,
      type,
    );
  }
}