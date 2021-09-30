import { Component, OnInit } from '@angular/core';
import { FormsModule, Form } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-create-car-form',
  templateUrl: './create-car-form.component.html',
  styleUrls: ['./create-car-form.component.scss']
})
export class CreateCarFormComponent implements OnInit {
  private _info: any;
  constructor(private apiService: ApiService, private jwt: JwtHelperService) { }

  ngOnInit() {
    this._info = localStorage.getItem('Auth_Token');
    // localStorage에 저장된 Token 값을 decode 해주어서
     // access.html의 _info.id, _info.name을 출력
    this._info = this.jwt.decodeToken(this._info);
  }

  async onSubmit(data) {
    console.log(data);
    return this.apiService.createCar(data.contract_name, data.contract_contents, data.contract_companyA, data.contract_companyB, data.contract_date, data.contract_period, this._info.id);
  }
}
