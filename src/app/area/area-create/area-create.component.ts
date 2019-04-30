import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AreaService} from "../../services/area.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

@Component({
  selector: 'app-area-create',
  templateUrl: './area-create.component.html',
  styleUrls: ['./area-create.component.css']
})
export class AreaCreateComponent implements OnInit {
  areaForm: FormGroup;
  error: boolean;

  invalid: boolean;
  contentLoading = false;

  private mode = "create";
  private areaId: string;

  constructor(private areaService: AreaService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.contentLoading = true;
    this.areaService.areaAddError.subscribe(error =>{
      this.error = error;
    });
    this.areaForm = new FormGroup({
      code: new FormControl('', {validators: [Validators.required, Validators.pattern("^[0-9]*$")]}),
      name: new FormControl('', {validators: [Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z0-9]*$")]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('id')) {
        this.areaService.getArea(paramMap.get('id'))
          .subscribe(data => {
            this.contentLoading = false;
            this.areaForm.setValue({
              code: data.area.code,
              name: data.area.name
            });
            this.mode = "edit";
            this.areaId = data.area._id;
          }, () => {
            console.log("No area exists with the given ID")
          });
      } else {
        this.contentLoading = false;
        this.mode = "create";
        this.areaId = null;
      }
    });

  }

  saveArea() {
    if(this.areaForm.invalid){
      this.invalid = this.areaForm.controls.code.invalid;
      return;
    }
    if(this.mode === 'edit'){
      this.areaService.updateArea(this.areaId, this.areaForm.value);
    } else {
      this.areaService.addArea(this.areaForm.value);
    }
  }

  goBack() {
    this.router.navigate(['/area']);
  }

}
