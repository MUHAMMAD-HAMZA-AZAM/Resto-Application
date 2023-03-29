import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { apiRoutes } from '../routes/apiRoutes';
import { appRoutes } from '../routes/appRoutes';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiRoutes = apiRoutes;
  appRoutes = appRoutes;
  baseURL = "http://localhost:3000";
  constructor(private http: HttpClient, public _modalService: NgbModal) { }
  get(api: string) {
    return this.http.get(this.baseURL + api).pipe(map((response: any) => {
      if (typeof response == 'string') {
        return JSON.parse(response);
      }
      else {
        return response;
      }
    }));
  }

  post(api: string, data: any, responseType: any = "json") {
    let token = null;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': '*', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': '*', 'Authorization': `Bearer ${token}` });
    let options = { headers: headers, responseType: responseType };
    return this.http.post(this.baseURL + api, JSON.stringify(data), options).pipe(map((response: any) => {
      if (typeof response == "string") {
        return JSON.parse(response);
      }
      else {
        return response;
      }
    }));
  }

  put(api: string, data: any, responseType: any = "json") {
    let token = null;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': '*', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': '*', 'Authorization': `Bearer ${token}` });
    let options = { headers: headers, responseType: responseType };
    return this.http.put(this.baseURL + api, JSON.stringify(data), options).pipe(map((response: any) => {
      if (typeof response == "string") {
        return JSON.parse(response);
      }
      else {
        return response;
      }
    }));
  }

  delete(api: string) {
   return this.http.delete(this.baseURL + api).pipe(map((response: any) => {
      if (typeof response == 'string') {
        return JSON.parse(response);
      }
      else {
        return response;
      }
    }));
  }

  //------- Reset Form
  resetForm(formName: FormGroup) {
    formName.reset();
  }

  closeModal() {
    this._modalService.dismissAll();
  }
}
