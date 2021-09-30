import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-contract-company-b',
  templateUrl: './contract-company-b.component.html',
  styleUrls: ['./contract-company-b.scss']
})

export class ContractCompanyBComponent implements OnInit {
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
      this.cars = carsArray;  
    });
  }

  async onSubmit(data){
    console.log("key >>> ", this.cars.key, "\nsignB >>> ", data.contract_signB, "\nstate >>> ", this.cars.state );
    this.router.navigate(['main']);
    return await this.apiService.makeContract(this.cars.key,data.contract_signB, this.cars.state, this._info.id);

  }

}