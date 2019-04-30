import {Injectable} from "@angular/core";
import {Product} from "../models/product.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class ProductService {
  private products: Product[] = [];
  private url = "http://localhost:3000/api/products";
  private productsUpdated = new Subject<{products:Product[], count: number}>();
  productAddError = new Subject<boolean>();
  count: number;

  constructor(private http: HttpClient, private router: Router) {}

  getProducts(currentPage, clientPerPage) {
    const queryParams = `?pageSize=${clientPerPage}&currentPage=${currentPage}`;
    this.http.get<{message: string, products: Product[], count: number}>(this.url + queryParams)
      .subscribe(productsData =>{
        this.products = productsData.products;
        this.count = productsData.count;
        this.productsUpdated.next({products:[...this.products], count: this.count});
      });
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  getProduct(id: String) {
    return this.http.get<{product: Product}>(this.url+"/"+ id);
  }

  addProduct(product: Product) {
    this.http.post<{message: string, product: Product}>(this.url, product)
      .subscribe((productData) =>{
        this.products.push(productData.product);
        this.productsUpdated.next({products:[...this.products], count: this.count});
        this.router.navigate(['/product']);
      },(error) =>{
        console.log(error);
        this.productAddError.next(true);
      });
  }

  updateProduct(id, data) {
    this.http.put<{message: string, product: Product}>(this.url+"/"+id,  {id, ...data})
      .subscribe(updatedData =>{
        this.router.navigate(['/product']);
      },(error) =>{
        this.productAddError.next(true);
      });
  }


  editProduct(product: Product) {
    this.router.navigate(['/product/edit',product._id]);
  }

  deleteProduct(product: Product) {
    this.http.delete<{message: string}>(this.url+"/"+product._id)
      .subscribe(() =>{
        this.products = this.products.filter((item) => item._id != product._id);
        this.count -= 1;
        this.productsUpdated.next({products:[...this.products], count: this.count});
      },() =>{
        console.log("error!");
      });
  }
}
