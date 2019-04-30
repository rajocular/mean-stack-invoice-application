import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  personalDetails: FormGroup;
  organizationDetails: FormGroup;
  databaseDetails: FormGroup;

  connectionStatus: boolean = false;

  constructor( private fb: FormBuilder, private loginService: LoginService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.personalDetails = this.fb.group({
      firstname: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      lastname: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      address: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      city: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      state: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      country: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      pincode: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.maxLength(6)]}),
      contact: new FormControl('', {validators: [Validators.required, Validators.pattern('^[0-9]{10}$')]})
    });

    this.organizationDetails = this.fb.group({
      organization: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      gstnumber: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
    });

    this.databaseDetails = this.fb.group({
      username: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$')]}),
      password: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*$'), Validators.minLength(8)]})
    })
  }

  register() {
    let userData = {
      firstname: this.personalDetails.value.firstname,
      lastname: this.personalDetails.value.lastname,
      address: this.personalDetails.value.address,
      city: this.personalDetails.value.city,
      state: this.personalDetails.value.state,
      country: this.personalDetails.value.country,
      pincode: this.personalDetails.value.pincode,
      contact: +this.personalDetails.value.contact,
      organization: this.organizationDetails.value.organization,
      gstnumber: this.organizationDetails.value.gstnumber,
      username: this.databaseDetails.value.username,
      password: this.databaseDetails.value.password
    };
    this.loginService.registerData(userData);

  }

  checkConnection() {
    this.loginService.checkConnection();
    this.loginService.getConnectionStatus().subscribe(status=>{
      this.connectionStatus = status==1
    });
  }
}
