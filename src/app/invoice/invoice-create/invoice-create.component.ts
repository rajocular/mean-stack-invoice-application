import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {InvoiceService} from "../../services/invoice.service";
import {Client} from "../../models/client.model";
import {Product} from "../../models/product.model";
import {ClientService} from "../../services/client.service";
import {Observable, Subject} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Bill} from "../../models/bill.model";

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})

export class InvoiceCreateComponent implements OnInit, OnDestroy {
  invoiceForm: FormGroup;
  billItems: FormArray;

  error: boolean;
  clients: Client[];
  products: Product[];
  userData;
  clientDetails;

  invoiceAmount = 0;
  invoiceTaxAmount = 0;
  invoiceTotal = 0;

  productControl = new FormControl();
  quantityControl = new FormControl();

  options: string[] = [];
  filteredOptions: Observable<string[]>;

  buyerError: boolean;
  productError: boolean;
  loading = false;
  contentModified: boolean;

  private productCreated = false;
  private mode = "create";
  private invoiceId: string;
  private billUpdateListener = new Subject();

  constructor(private invoiceService: InvoiceService, private route: ActivatedRoute, private router: Router,
              private clientService: ClientService, private productService: ProductService, private fb: FormBuilder) { }

  ngOnInit() {
    this.loading = true;
    this.contentModified = false;
    this.fetchProducts();
    this.invoiceService.getUserData().subscribe(data=>{
      this.userData = data.user
    }, error=>{
      console.log(error)
    });

    this.invoiceService.invoiceAddError.subscribe(error =>{
      this.error = error;
    });

    this.filteredOptions = this.productControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.createForm();

    this.billUpdateListener.subscribe(next=>{
      console.log(next)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('id')) {
        this.fetchProducts();
        this.invoiceService.getInvoice(paramMap.get('id'))
          .subscribe(data => {
            this.loading = false;
            this.clientDetails = data.invoice.client;
            for (let bill in data.invoice.bills){
              let billData = data.invoice.bills[bill];
              this.billItems = this.invoiceForm.get('billItems') as FormArray;
              this.billItems.push(this.createItem(billData.product.name, billData.quantity));
            }
            this.invoiceForm.patchValue({
              client: data.invoice.client._id,
              date: data.invoice.date
            });
            this.mode = "edit";
            this.invoiceId = data.invoice._id;
          }, () => {
            console.log("No area exists with the given ID")
          });
      } else {
        this.loading = false;
        this.mode = "create";
        this.invoiceId = null;
      }
    });

  }

  private fetchProducts() {
    this.productService.getProducts(null, null);
    this.productService.getProductUpdateListener()
      .subscribe(({products, count}) =>{
        this.products = products;
        for (let product in products){
          this.options.push(products[product].name)
        }
        this.clientService.getByType("buyer", null, null);
        this.clientService.getClientUpdateListener()
          .subscribe(({clients, count})=>{
            this.clients = clients;
          })
      });

  }

  private createForm() {
    this.invoiceForm = this.fb.group({
      client: new FormControl(this.clients, Validators.required),
      date: new FormControl(new Date(), Validators.required),
      billItems: this.fb.array([ ], Validators.required)
    });
  }

  createItem(product: string, quantity: number): FormGroup {
    if(!this.productCreated){
      this.productCreated = true;
    }
    if(!this.products){
      this.router.navigate(['/invoice'])
    }else {
      let productData = this.products.filter((item) => item.name == product)[0];
      let amount = productData.sale_price * quantity;
      this.invoiceAmount += amount;

      let tax_amount = +((amount * productData.tax) / 100).toFixed(4);
      this.invoiceTaxAmount += tax_amount;

      this.invoiceTotal += amount + tax_amount;

      return this.fb.group({
        name: new FormControl({value: productData.name, disabled: true}),
        quantity: new FormControl({value: quantity, disabled: true}),
        cost_price: new FormControl({value: productData.cost_price, disabled: true}),
        sale_price: new FormControl({value: productData.sale_price, disabled: true}),
        mrp: new FormControl({value: productData.mrp, disabled: true}),
        tax: new FormControl({value: productData.tax, disabled: true}),
        amount: new FormControl({value: amount, disabled: true}),
        tax_amount: new FormControl({value: tax_amount, disabled: true}),
        total: new FormControl({value: amount + tax_amount, disabled: true})
      });
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addProduct() {
    this.contentModified = true;
    if(this.quantityControl.valid && this.productControl.valid) {
      let productData = this.products.filter((item)=> item.name == this.productControl.value)[0];
      if(this.quantityControl.value>productData.stock){
        alert("Not enough stock for the selected product\nAvailable on hand:"+productData.stock);
        return;
      }
      if(productData) {
        productData.stock -= +this.quantityControl.value;
        this.billItems = this.invoiceForm.get('billItems') as FormArray;
        this.billItems.push(this.createItem(this.productControl.value, this.quantityControl.value));
      }
      else {
        this.productError = true;
      }
    }
  }

  saveArea() {
    this.contentModified = false;
    if(this.invoiceForm.invalid || this.billItems.value.length==0){
      this.buyerError = this.invoiceForm.controls.billItems.invalid == true;
      return;
    }
    let billData: Bill[] = [];
    for (let bill of this.billItems.value){
      billData.push({
        product: this.products.filter((item)=>item.name == bill.name)[0],
        quantity: bill.quantity,
        amount: bill.amount,
        tax_amount: bill.tax_amount,
        total: bill.total
      });
    }
    for(let product in this.products){
      let prodData = this.products[product];
      this.productService.updateStock(prodData._id, prodData)
    }
    if(this.mode === 'create') {

      this.invoiceService.addInvoice({
        _id: null,
        client: this.invoiceForm.value.client,
        date: this.invoiceForm.value.date,
        bills: billData,
        amount: this.invoiceAmount,
        tax_amount: this.invoiceTaxAmount,
        total: this.invoiceTotal
      });
    } else {
      this.invoiceService.updateInvoice(this.invoiceId, {
        client: this.invoiceForm.value.client,
        date: this.invoiceForm.value.date,
        bills: billData,
        amount: this.invoiceAmount,
        tax_amount: this.invoiceTaxAmount,
        total: this.invoiceTotal
      });
    }
  }

  onDelete(index: number, item) {
    (<FormArray>this.invoiceForm.get('billItems')).removeAt(index);
    this.invoiceAmount -= item.value.amount;
    this.invoiceTaxAmount -= item.value.tax_amount;
    this.invoiceTotal -= item.value.total;
    if(this.billItems.value.length == 0){
      this.productCreated = false;
    }
  }

  onReset() {
    this.productControl.reset();
    this.quantityControl.reset();
  }


  goBack() {
    this.router.navigate(['/invoice']);
  }

  printInvoice(e) {
    // this.router.navigate(['/invoice/print/', this.invoiceId]);
    e.preventDefault();
    window.print()
  }

  clientData(client){
    this.clientDetails = client;
  }


  ngOnDestroy() {
    // this.productCreated =false;
    if(this.contentModified){
      if(confirm("would you like to save Invoice before you leave")) {
        this.saveArea()
      }
    }
  }

}
