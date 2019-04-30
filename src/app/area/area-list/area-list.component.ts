import { Component, OnInit } from '@angular/core';
import {Area} from "../../models/area.model";
import {AreaService} from "../../services/area.service";
import {MatTableDataSource, PageEvent} from "@angular/material";

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.css']
})
export class AreaListComponent implements OnInit {
  areas: Area[];
  dataSource: MatTableDataSource<Area>;
  displayedColumns: string[] = ['code', 'name'];

  totalArea = 0;
  areasPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  contentLoading = false;

  constructor(private areaService: AreaService) { }

  ngOnInit() {
    this.contentLoading = true;
    this.areaService.getAreas(this.currentPage, this.areasPerPage);
    this.areaService.getAreaUpdateListener()
      .subscribe(({areas, count}) =>{
        this.contentLoading = false;
        this.areas = areas;
        this.totalArea = count;
        this.dataSource = new MatTableDataSource(this.areas);
      });
  }

  onEdit(element: Area) {
    this.areaService.editArea(element._id);
  }

  onChange(data: PageEvent) {
    this.currentPage = data.pageIndex + 1;
    this.areasPerPage = data.pageSize;
    this.areaService.getAreas(this.currentPage, this.areasPerPage);
  }

  onDelete(element: Area) {
    confirm("Are you sure that you want to delete this area?")? this.areaService.deleteArea(element): null;
  }


}
