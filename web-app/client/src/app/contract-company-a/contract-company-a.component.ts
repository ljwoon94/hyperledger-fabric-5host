import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-contract-company-a',
  templateUrl: './contract-company-a.component.html',
  styleUrls: ['./contract-company-a.scss']
})
export class ContractCompanyAComponent implements OnInit {
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

  async onSubmit(data){
    console.log(this.cars.key,data.contract_signA, data.contract_receiver, this.cars.state );
    this.router.navigate(['main']);
    return await this.apiService.sendContract(this.cars.key,data.contract_signA, data.contract_receiver, this.cars.state, this._info.id);

  }

  // 로그아웃
  logOut(){
    if(confirm('로그아웃 하시겠습니까?') == true){
      // localStorage에 저장된 Token 값을 삭제
      localStorage.removeItem('Auth_Token');
      this.router.navigate(['/login']);
    }
  }

}