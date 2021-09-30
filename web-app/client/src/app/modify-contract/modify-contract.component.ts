import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-modify-contract',
  templateUrl: './modify-contract.component.html',
  styleUrls: ['./modify-contract.scss']
})
export class ModifyContractComponent implements OnInit {
  private _info: any;
  cars: any;
  result;
  constructor(private apiService: ApiService, private router: Router, private jwt: JwtHelperService) { }



  ngOnInit() {

    this._info = localStorage.getItem('Auth_Token');
    // localStorage에 저장된 Token 값을 decode 해주어서
     // access.html의 _info.id, _info.name을 출력
    this._info = this.jwt.decodeToken(this._info);
    this.apiService.selectCars$.subscribe((carsArray: any) => {
      console.log(carsArray);        
            this.cars = carsArray;
    });
  }

  async onSubmit(data) {
    console.log(data);
    return await this.apiService.changeCarOwner(this.cars.key, data.contract_name, data.contract_contents, data.contract_companyB, data.contract_receiver, data.contract_date, data.contract_period, this._info.id);
  }

}