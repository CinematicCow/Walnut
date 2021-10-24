import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStockDto } from './dto/update-stock.dto';
import { Product } from './entities/product.entity';
// import GithubSlugger from 'github-slugger';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepositiry: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, stock, price, categoryId } = createProductDto;
    const product = new Product();
    product.name = name;
    product.slug = await this.Slug(name);
    product.description = description;
    product.stock = stock;
    product.price = price;
    product.categoryId = categoryId;

    await this.productRepositiry.save(product);

    return product;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepositiry.find();
  }

  async findOne(id: string): Promise<Product> {
    try {
      return await this.productRepositiry.findOneOrFail(id);
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productRepositiry.findOne({ where: { slug } });
    if (!product) throw new NotFoundException('No product found');
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<boolean> {
    try {
      await this.findOne(id);
      await this.productRepositiry.update(id, updateProductDto);
      return true;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      await this.productRepositiry.delete(id);
      return true;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateStock(
    id: string,
    updateProductStockDto: UpdateProductStockDto,
    type: string,
  ): Promise<boolean> {
    const { stock } = updateProductStockDto;
    const product = await this.findOne(id);

    if (type === 'remove') {
      if (stock > product.stock)
        throw new HttpException(
          'Removed stock greater than existing stock',
          HttpStatus.CONFLICT,
        );
      await this.productRepositiry.update(id, { stock: product.stock - stock });
      return true;
    } else if (type === 'add') {
      await this.productRepositiry.update(id, { stock: product.stock + stock });
      return true;
    } else {
      throw new HttpException('INVALID', HttpStatus.BAD_REQUEST);
    }
  }

  private async Slug(title: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, count] = await this.productRepositiry.findAndCount({
      where: { name: title },
    });
    let slug: string;

    // convert to lower case
    slug = title.toLowerCase();

    // remove special characters
    slug = slug.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      '',
    );
    // The /gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string

    // replace spaces with dash symbols
    slug = slug.replace(/ /gi, '-');

    // remove consecutive dash symbols
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    // remove the unwanted dash symbols at the beginning and the end of the slug
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    if (count < 1) {
      return `${slug}`;
    } else {
      return `${slug}-${count}`;
    }
  }
}
