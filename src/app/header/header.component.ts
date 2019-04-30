import { Component, OnInit } from '@angular/core';
import {LoginService} from "../services/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.isAuthenticated = this.loginService.getIsAuthenticated();
    this.loginService.getAuthUpdateListener().subscribe(isAuthenticated =>{
      this.isAuthenticated = isAuthenticated;
    })
  }

  logout() {
    this.loginService.logout();
  }

}
