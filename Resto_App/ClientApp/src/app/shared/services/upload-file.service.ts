import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IImgData } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  data: any = { message: "", data: "" };
  resData: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor() {
  }
  validateandUploadFile(file: any, Iheight: any, Iwidth: any): any {
    let fileToUpload = file;
    if (fileToUpload.type == "image/jpeg" || fileToUpload.type == "image/png" || fileToUpload.type == "image/jpeg") {
      //Show image preview
      //Read the contents of Image File.
      let reader = new FileReader();
      reader.readAsDataURL(fileToUpload);
      reader.onload = (event: any) => {
        //Initiate the JavaScript Image object.
        var img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width <= Iwidth && height <= Iheight) {
            //Set the Base64 string return from FileReader as source.
              this.data.data = event.target.result;
            this.data.message = "Uploaded image has valid Height and Width.";
            this.resData.next(this.data);

          } else {

            this.data.message = "You can maximum upload " + Iheight + " * " + Iwidth + " File";
            this.data.data = "";
            this.resData.next(this.data);
          //  return this.resData;
          }
        };
        img.src = event.target.result;
      }

    } else {
      this.data.message = "You can't be able to upload file except JPG and PNG format";
      this.data.data = "";
      this.resData.next(this.data);
     // return this.resData;
    }
  }
}
