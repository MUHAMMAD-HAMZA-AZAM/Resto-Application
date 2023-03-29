import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { HttpService } from '../../shared/services/_http.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { ExportsService } from '../../shared/services/exports.service';
import { UploadFileService } from '../../shared/services/upload-file.service';
@Component({
  selector: 'app-resturants',
  templateUrl: './resturants.component.html',
  styleUrls: ['./resturants.component.css']
})
export class ResturantsComponent {
  searchTerm: string='';
  modalTitle: string = '';
  base64Image: any = '';
  states: any = [];
  cities: any = [];
  cityList: any = [];
  resturents: any = [];
  resturentsData: any = [];
  data = {};
  appValForm: FormGroup;

  //------- State Dropdown Configuration
  public statesConfig:any = {
    displayKey: "name",
    search: true,
    placeholder: "--- Select State ---",
    enableSelectAll: false
  }

  //------- City Dropdown Configuration
  public cityConfig: any = {
    displayKey: "name",
    search: true,
    placeholder: "--- Select City ---",
    enableSelectAll: false,
  }

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  @ViewChild('inputFile') uploadedFile: ElementRef;
  constructor(private _modelService: NgbModal, public fb: FormBuilder,
    public _httpService: HttpService,
    public _exportsService: ExportsService,
    public _uploadService: UploadFileService
  ) {
    this.appValForm = {} as FormGroup;
    this.searchInput = {} as ElementRef;
    this.uploadedFile = {} as ElementRef;
  }
  ngOnInit() {
    this.inItResturentForm();
    this.getStates();
  }
  get f() {
    return this.appValForm.controls;
  }
  inItResturentForm() {
    this.appValForm = this.fb.group({
      id:[0],
      name: ['', Validators.required],
      email: ['', Validators.required],
      stateId: [null, Validators.required],
      cityId: [null, Validators.required],
      restoImage:[''],
      termAndConditions:[true]
    });
  }

  //------------------  Resturent Image Work
  handleFileChangeEvent(uploadFile: any) {
   // console.log(this.uploadedFile.nativeElement.value);
    let file = uploadFile.target.files[0];
    this._uploadService.validateandUploadFile(file,1000,1000);
    this._uploadService.resData.subscribe((res: any) => {
      if (res?.data) {
        this.base64Image = res.data;
        window.alert(res.message);
      }
    }, error => {
      console.log(error);
    });
  }


  //------------------------ Exports Option

  downloadAsPDF() {
    let doc = new jsPDF('l', 'pt', 'a4');
    autoTable(doc, {
      html: '#dataTable',
      theme: 'striped',
      columns: [
        { header: 'Sr#', dataKey: '' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'State', dataKey: 'stateName' },
        { header: 'City', dataKey: 'cityName' },
      ]
    });
    doc.save('Report.pdf');
  }

  downloadAsCSV() {
    this.resturentsData = this.resturents.map((item: any) => {
      return {
        Name: item.name,
        Email: item.email,
        State: item.stateName,
        City: item.cityName
      }
    });
    console.log(this.resturentsData);
    this._exportsService.exportToCSV(this.resturentsData, 'Report');
  }

  downloadAsExcel() {
    this.resturentsData = this.resturents.map((item: any) => {
      return {
        Name: item.name,
        Email: item.email,
        State: item.stateName,
        City:item.cityName
      }
    });
    console.log(this.resturentsData);
    this._exportsService.exportToExcel(this.resturentsData);
  }
  //---------- Get All Resturents
  getAllResturents() {
    this._httpService.get(this._httpService.apiRoutes.Resturents.GetResturents).subscribe((res: any) => {
      if (res?.length > 0) {
        this.resturents = res;
        this.resturents.forEach((item:any,index:any) => {
          this.states.forEach((sItem: any, sIndex: any) => {
            if (this.states[sIndex].stateId == this.resturents[index].stateId) {
              this.resturents[index].stateName = this.states[sIndex].name;
            }
          });
          this.cityList.forEach((cItem: any, cIndex: any) => {
            if (this.cityList[cIndex].cityId == this.resturents[index].cityId) {
              this.resturents[index].cityName = this.cityList[cIndex].name;
            }
          });
        });
      }
    }, error => {
      console.log(error);
    });
  }


   //---------- Get States for Dropdown
  getStates() {
    this._httpService.get(this._httpService.apiRoutes.States.GetStates).subscribe((res: any) => {
      this.states = <any>res;
      this.getCities();
    }, error => {
      console.log(error);
    });
  }

  //---------- Get All Cities 
  getCities() {
    this._httpService.get(this._httpService.apiRoutes.Cities.GetAllCities).subscribe((res: any) => {
      this.cityList = <any>res;
      //console.log(this.cityList);
      this.getAllResturents();
    }, error => {
      console.log(error);
    });
  }

  //---------- Get Cities By State
  stateChanged(option: any) {
    let id = option.value.stateId
    this.appValForm.controls['cityId'].setValue(null);
    this._httpService.get(this._httpService.apiRoutes.Cities.GetCitiesByState + `?stateId=${id}`).subscribe((res: any) => {
      //console.log(res);
      if (res?.length) {
        this.cities = <any>res;
      }   
    }, error => {
      console.log(error);
    });
    
  }

  //-------------- Save and Udpdate Resturent
  saveAndUpdate() {
    let formData = this.appValForm.value;
    if (this.appValForm.valid) {
      formData.stateId = formData.stateId ? formData.stateId.stateId : 0;
      formData.cityId = formData.cityId ? formData.cityId.cityId : 0;
      formData.restoImage = this.base64Image;
      //formData.restoImage = JSON.stringify(this.base64Image);
      console.log(formData);
      if (formData.id > 0) {
        this._httpService.put(this._httpService.apiRoutes.Resturents.UpdateResturent + "/" + formData.id, formData).subscribe((res: any) => {
          if (res) {
            // this._toastr.success("Data saved", "successfully");
            this._httpService.closeModal();
            this._httpService.resetForm(this.appValForm);
            this.getAllResturents();
          }
          else {
            //this._toastr.error("Something went wrong", "error");
          }
        }, error => {
          console.log(error);
        });
      }
      else {
        this._httpService.post(this._httpService.apiRoutes.Resturents.CreateResturent, formData).subscribe((res: any) => {
          console.log(res);
          if (res) {
            // this._toastr.success("Data saved", "successfully");
            this._httpService.closeModal();
            this._httpService.resetForm(this.appValForm);
            this.getAllResturents();
          }
          else {
            //this._toastr.error("Something went wrong", "error");
          }
        }, error => {
          console.log(error);
        });
      }
    }
    else {
      this.appValForm.markAllAsTouched();
      return;
    }
    
  }

  //---------- Update Resturent
  editResturent(formData: any, modalRef: TemplateRef<any>) {
    formData.stateId = this.states.find((x: any) => x.stateId == formData.stateId);
    formData.cityId = this.cityList.find((x: any) => x.cityId == formData.cityId);
    this.base64Image = formData.restoImage;
    this.appValForm.patchValue(formData);
    this.openModal(modalRef,'Edit Resturent');
  }

  //---------- Delete Resturent
  deleteResturent(id: any) {
    this._httpService.delete(this._httpService.apiRoutes.Resturents.DeleteResturent + "/" + id).subscribe((response: any) => {
      this.getAllResturents();
    });
  }
  //-------------- Open Modal for Save and Update Resturent
  openModal(modalRef: TemplateRef<any>, modalName: string) {
    this.modalTitle = modalName;
    this._modelService.open(modalRef);
  }

  //----------- Optimze Search Like Google 
  ngAfterViewInit() {
    this.handleSearch();
  }
  handleSearch() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(1000),
      distinctUntilChanged()).subscribe((response: any) => {
        this.searchTerm = response;
        if (this.searchTerm) {
          this._httpService.get(this._httpService.apiRoutes.Resturents.GetResturentByName + `?name=${this.searchTerm}`)
            .subscribe((res: any) => {
              this.resturents = res;
              this.resturents.forEach((item: any, index: any) => {
                this.states.forEach((sItem: any, sIndex: any) => {
                  if (this.states[sIndex].stateId == this.resturents[index].stateId) {
                    this.resturents[index].stateName = this.states[sIndex].name;
                  }
                });
                this.cityList.forEach((cItem: any, cIndex: any) => {
                  if (this.cityList[cIndex].cityId == this.resturents[index].cityId) {
                    this.resturents[index].cityName = this.cityList[cIndex].name;
                  }
                });

              });
            });
        }
        else {
          this.getStates();
        }

      });

  }

}



//Now, We need to consider some point while implementing Real Time search functionality

//At least three characters to be entered for making search api call
//When user stop typing then only search api call should go
//Simultaneous api call should not go for api call
//Api call should happen when search string is different from previous search string.
