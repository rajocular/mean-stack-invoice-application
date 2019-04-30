import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../../services/client.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Area} from "../../models/area.model";
import {AreaService} from "../../services/area.service";

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css']
})
export class ClientCreateComponent implements OnInit {
  clientForm: FormGroup;
  error: boolean;
  invalid: boolean;
  loading = false;

  private mode = "create";
  private clientId: string;
  private clientType: string;
  private areas: Area[];

  constructor(private clientService: ClientService, private router: Router,
              private route: ActivatedRoute, private areaService: AreaService) { }

  ngOnInit() {
    this.loading = true;
    this.clientService.clientAddError.subscribe(error =>{
      this.error = error;
    });

    this.areaService.getAreas(null,null);
    this.areaService.getAreaUpdateListener()
      .subscribe(({areas, count}) =>{
        this.areas = areas;
      });

    this.clientForm = new FormGroup({
      name: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      area: new FormControl('', Validators.required),
      address: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*')]}),
      contact: new FormControl('', {validators: [Validators.required, Validators.pattern("^[0-9]{10}$")]}),
      pincode: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]}),
      gstnumber: new FormControl('', Validators.required)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      this.clientType = paramMap.get('type');
      if(paramMap.has('id')) {
        this.clientService.getClient(paramMap.get('id'))
          .subscribe(data => {
            this.loading = false;
            this.clientForm.setValue({
              name: data.client.name,
              area: data.client.area._id,
              address: data.client.address,
              contact: data.client.contact,
              pincode: data.client.pincode,
              gstnumber:data.client.gstnumber
            });
            this.mode = "edit";
            this.clientId = data.client._id;
          }, () => {
            console.log("No area exists with the given ID")
          });
      } else {
        this.loading = false;
        this.mode = "create";
        this.clientId = null;
      }
    });

  }

  saveArea() {
    if(this.clientForm.invalid){
      this.invalid = this.clientForm.controls.contact.invalid;
      return;
    }
    if(this.mode === 'edit'){
      this.clientService.updateClient(this.clientId, this.clientType, this.clientForm.value);
    } else {
      this.clientService.addClient(this.clientType, this.clientForm.value);
    }
  }

  goBack() {
    this.router.navigate(['/client/',this.clientType]);
  }

}
