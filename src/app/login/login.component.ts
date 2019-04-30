import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {LoginService} from "../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isAuthenticated = true;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
    this.loginService.getAuthUpdateListener().subscribe(isAuthenticated=>{
      this.isAuthenticated = isAuthenticated;
    });
  }

  loginCheck() {
    this.loginService.login(this.loginForm.value);
  }

  register() {
    this.loginService.register();
  }

}
