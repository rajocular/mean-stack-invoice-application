import {Injectable} from "@angular/core";
import {Area} from "../models/area.model";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AreaService{
  private areas: Area[]=[];
  private url = "http://localhost:3000/api/areas";
  private areasUpdated = new Subject<{areas:Area[], count:number}>();
  areaAddError = new Subject<boolean>();
  count;

  constructor(private http: HttpClient, private router: Router) {}

  getAreas(currentPage, areasPerPage) {
    const queryParams = `?pageSize=${areasPerPage}&currentPage=${currentPage}`;
    this.http.get<{message: string, areas: any, count: number}>(this.url+queryParams)
      .subscribe((areaData) =>{
        this.areas = areaData.areas;
        this.count = areaData.count;
        this.areasUpdated.next({areas:[...this.areas], count:this.count});
      });
  }

  getAreaUpdateListener() {
    return this.areasUpdated.asObservable();
  }

  getArea(id: string) {
    return this.http.get<{area: Area}>(this.url+"/"+id);
  }

  editArea(id: string) {
    this.router.navigate(['/area/','edit',id])
  }

  addArea(area: Area) {
    this.http.post<{message: string, area: Area}>(this.url,area)
      .subscribe((areaData) =>{
        this.areas.push(areaData.area);
        this.areasUpdated.next({areas:[...this.areas], count:this.count});
        this.router.navigate(["/area"]);
      },(error) =>{
        this.areaAddError.next(true);
      });
  }

  updateArea(id, {code, name}) {
    this.http.put<{message: string, area: Area}>(this.url+"/"+id,  {id, code, name})
      .subscribe(updatedData =>{
        this.router.navigate(['/area']);
      },()=>{
        this.areaAddError.next(true);
      });
  }

  deleteArea(area: Area) {
    this.http.delete<{message: string}>(this.url+"/"+area._id)
      .subscribe(result =>{
        this.areas = this.areas.filter((item) => item._id != area._id);
        this.count -= 1;
        this.areasUpdated.next({areas:[...this.areas], count:this.count});
      },(error) =>{
        console.log("error!");
      });
  }

}
