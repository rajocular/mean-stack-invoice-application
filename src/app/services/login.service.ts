import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {User} from "../models/user.model";

@Injectable({providedIn: 'root'})
export class LoginService {
  private url = "http://localhost:3000";
  private token: string;
  private isAuthenticated = false;
  private authUpdated = new Subject<boolean>();
  private statusListener = new Subject<number>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getConnectionStatus() {
    return this.statusListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthUpdateListener() {
    return this.authUpdated.asObservable();
  }

  registerData(userData) {
    this.http.post(this.url+"/register", userData).subscribe((result)=>{
      console.log(result)
    },error=>{
      console.log(error)
    });
    this.router.navigate(['/']);
  }

  login({username, password}){
    this.http.post<{user: User, token: string}>(this.url+"/login", {username, password}).subscribe((result)=>{
      if(result.token){
        this.token = result.token;
        this.rememberLogin(result.token);
        this.isAuthenticated = true;
        this.authUpdated.next(true);
        this.router.navigate(['invoice']);
      }
    }, ()=>{
      this.isAuthenticated = false;
      this.authUpdated.next(false)
    });
  }

  rememberLogin(token) {
    localStorage.setItem('token', token);
  }

  clearLogin() {
    localStorage.removeItem('token');
  }

  checkLogin() {
    const token = localStorage.getItem('token');
    if(token){
      this.token = token;
      this.isAuthenticated = true;
      this.authUpdated.next(true);
    }
  }

  logout() {
    this.http.post(this.url+ "/logout", '').subscribe(()=>{
      this.clearLogin();
      this.token = null;
      this.isAuthenticated = false;
      this.authUpdated.next(false);
      this.router.navigate(['/'])
    });
  }

  register() {
    this.router.navigate(['register']);
  }

  checkConnection() {
    this.http.get<{status: number}>(this.url + "/check-connection").subscribe(state=>{
      this.statusListener.next(state.status);
    });
  }

}
