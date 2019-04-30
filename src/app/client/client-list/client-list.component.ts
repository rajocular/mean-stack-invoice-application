import { Component, OnInit } from '@angular/core';
import {Area} from "../../models/area.model";
import {Client} from "../../models/client.model";
import {ClientService} from "../../services/client.service";
import {MatTableDataSource, PageEvent} from "@angular/material";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[];
  type: string;
  loading = false;

  dataSource: MatTableDataSource<Client>;
  displayedColumns: string[] = ['name', 'area', 'gstnumber', 'address', 'contact', 'pincode', 'options'];

  totalClients = 0;
  clientsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private clientService: ClientService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      this.type = paramMap.get('type');
      this.clientService.getByType(this.type, this.currentPage, this.clientsPerPage);
      this.clientService.getClientUpdateListener()
        .subscribe(({clients, count}) =>{
          this.loading = false;
          this.clients = clients;
          this.totalClients = count;
          this.dataSource = new MatTableDataSource(this.clients);
        });
    });

  }
  //
  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  onEdit(element: Client) {
    this.clientService.editClient(element);
  }

  onChange(data: PageEvent) {
    this.currentPage = data.pageIndex + 1;
    this.clientsPerPage = data.pageSize;
    this.clientService.getByType(this.type, this.currentPage, this.clientsPerPage);
  }

  onDelete(element: Client) {
    confirm("Are you sure that you want to delete this area?")? this.clientService.deleteClient(element): null;
  }

}
