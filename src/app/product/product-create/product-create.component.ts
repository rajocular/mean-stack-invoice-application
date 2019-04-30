import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  error: boolean;

  loading = false;

  taxOptions = [5 , 12, 18, 28];

  private mode = "create";
  private productId: string;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.productService.productAddError.subscribe(error =>{
      this.error = error;
    });

    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      hsncode: new FormControl('', {validators: [Validators.required, Validators.pattern("^[0-9]*$")]}),
      tax: new FormControl('', Validators.required),
      cost_price: new FormControl('', {validators: [Validators.required, Validators.pattern("^[0-9]*$")]}),
      sale_price: new FormControl('', {validators: [Validators.required, Validators.pattern("^[0-9]*$")]}),
      mrp: new FormControl('', {validators: [Validators.required, Validators.pattern("^[0-9]*$")]}),
      stock: new FormControl('', {validators: [Validators.required, Validators.pattern("^[0-9]*$")]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('id')) {
        this.productService.getProduct(paramMap.get('id'))
          .subscribe(data => {
            this.loading = false;
            this.productForm.setValue({
              name: data.product.name,
              hsncode: data.product.hsncode,
              tax: data.product.tax,
              cost_price: data.product.cost_price,
              sale_price: data.product.sale_price,
              mrp:data.product.mrp,
              stock: data.product.stock
            });
            this.mode = "edit";
            this.productId = data.product._id;
          }, () => {
            console.log("No area exists with the given ID")
          });
      } else {
        this.loading = false;
        this.mode = "create";
        this.productId = null;
      }
    });
  }

  saveArea() {
    if(this.productForm.invalid){
      return;
    }
    let formValues = this.productForm.value;
    if ((formValues.cost_price > formValues.sale_price || formValues.cost_price > formValues.mrp) ||
        (formValues.sale_price > formValues.mrp)){
      alert("Check price relationship:\n cost_price < sale_price < mrp")
    }else {
      if(this.mode === 'edit'){
        this.productService.updateProduct(this.productId, this.productForm.value);
      } else {
        this.productService.addProduct(this.productForm.value);
      }
    }
  }

  goBack() {
    this.router.navigate(['/product']);
  }

}
