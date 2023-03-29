import { Component } from '@angular/core';
import { HttpService } from '../../services/_http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public _httpService: HttpService) {

  }

  ngOnInit() {
    this.getAllResturents();
  }

  getAllResturents() {
    this._httpService.get(this._httpService.apiRoutes.Resturents.GetResturents).subscribe((res: any) => {
     // console.log(res);
    }, error => {
      console.log(error);
    });
  }
}
