import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-query-all-cars',
  templateUrl: './query-all-cars.component.html',
  styleUrls: ['./query-all-cars.component.scss']
})
export class QueryAllCarsComponent implements OnInit {

  private _info: any;
  private cars: any;
  // private cars: Array<object>;
  private loginUser: any;
  response;
  constructor(private apiService: ApiService, private http: HttpClient, private router:Router, private jwt: JwtHelperService) { }

  

  ngOnInit() {
    this._info = localStorage.getItem('Auth_Token');
    // localStorage에 저장된 Token 값을 decode 해주어서
     // access.html의 _info.id, _info.name을 출력
    this._info = this.jwt.decodeToken(this._info);
    this.apiService.cars$.subscribe((carsArray) => {
      this.cars = carsArray;
    });
  }

  
  sendKey(data) {
    for(var i=0; i<this.cars.length; i++){
      if(data == this.cars[i].Key){
        if(this.cars[i].Record.state == '계약 대기' && (this.cars[i].Record.contract_writer == this._info.id)){
          this.router.navigate(['contractA']);
        } else if(this.cars[i].Record.state == '계약 중' && this.cars[i].Record.contract_writer == this._info.id){
          this.router.navigate(['modifyContract']);
        } else if(this.cars[i].Record.state == '계약 중' && this.cars[i].Record.contract_writer != this._info.id){
          this.router.navigate(['contractB']);
        } else if(this.cars[i].Record.state == '계약 완료'){
          this.router.navigate(['readContract']);
      }
    }
  }
    return this.apiService.querySelectCar(data, this._info.id)
  }
  
  onSubmit(data) {
    for(var i=0; i<this.cars.length; i++){
      if(data.key == this.cars[i].Key){
        if(this.cars[i].Record.state == '계약 대기' && (this.cars[i].Record.contract_writer == this._info.id)){
          this.router.navigate(['contractA']);
        } else if(this.cars[i].Record.state == '계약 중' && this.cars[i].Record.contract_writer == this._info.id){
          this.router.navigate(['modifyContract']);
        } else if(this.cars[i].Record.state == '계약 중' && this.cars[i].Record.contract_writer != this._info.id){
          this.router.navigate(['contractB']);
        } else if(this.cars[i].Record.state == '계약 완료'){
          this.router.navigate(['readContract']);
      }
    }
  }
    return this.apiService.querySelectCar(data.key, this._info.id)
  }
}
