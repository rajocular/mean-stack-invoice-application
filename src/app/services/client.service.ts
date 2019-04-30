import {Injectable} from "@angular/core";
import {Client} from "../models/client.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class ClientService{
  private clients: Client[] =[];
  private url = "http://localhost:3000/api/clients";
  private clientsUpdated = new Subject<{clients:Client[], count: number}>();
  clientAddError = new Subject<boolean>();
  count: number;

  constructor(private http: HttpClient, private router: Router) {}

  getClients() {
    this.http.get<{message:string, clients: Client[]}>(this.url)
      .subscribe(clientData =>{
        this.clients = clientData.clients;
        this.clientsUpdated.next({clients: [...this.clients], count: this.count});
      });
  }

  getClient(id: string) {
    return this.http.get<{client: Client}>(this.url+"/id/"+id);
  }

  getClientUpdateListener() {
    return this.clientsUpdated.asObservable();
  }

  getByType(type: string, currentPage: number, clientsPerPage: number) {
    const queryParams = `?pageSize=${clientsPerPage}&currentPage=${currentPage}`;
    return this.http.get<{clients: Client[], count: number}>(this.url+"/"+type + queryParams)
      .subscribe(clientData =>{
        this.clients = clientData.clients;
        this.count = clientData.count;
        this.clientsUpdated.next({clients: [...this.clients], count: this.count});
      });
  }

  addClient(type: string, client: Client) {
    client.type = type;
    this.http.post<{message: string, client: Client}>(this.url, client)
      .subscribe((clientData) =>{
        this.clients.push(clientData.client);
        this.clientsUpdated.next({clients: [...this.clients], count: this.count});
        this.router.navigate(['/client/',type]);
      },(error) =>{
        console.log(error);
        this.clientAddError.next(true);
      });
  }

  updateClient(id, type, {name, area, address, contact, pincode, gstnumber}) {
    this.http.put<{message: string, client: Client}>(this.url+"/"+id,  {id, name, area, address, contact, pincode, gstnumber, type})
      .subscribe(() =>{
        this.router.navigate(['/client/',type]);
      },(error) =>{
        console.log(error);
        this.clientAddError.next(true);
      });
  }

  editClient(client: Client) {
    this.router.navigate(['/client/',client.type,'edit',client._id])
  }

  deleteClient(client: Client) {
    this.http.delete<{message: string}>(this.url+"/"+client._id)
      .subscribe(result =>{
        this.clients = this.clients.filter((item) => item._id != client._id);
        this.count -= 1;
        this.clientsUpdated.next({clients: [...this.clients], count: this.count});
      },(error) =>{
        console.log("error!");
      });
  }
}
