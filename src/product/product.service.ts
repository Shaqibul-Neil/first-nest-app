import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  private products = [
    { id: 1, name: 'Car', price: 20000 },
    { id: 2, name: 'Mobile', price: 2000 },
    { id: 3, name: 'Laptop', price: 10000 },
  ];

  getAllProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products.find((product) => product.id === id);
  }
}
