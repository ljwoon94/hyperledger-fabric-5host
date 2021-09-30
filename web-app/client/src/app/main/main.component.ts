import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public http: HttpClient, private router: Router, private jwt: JwtHelperService, private apiService: ApiService) { }


  _info : any;
  userName$: any;  

  ngOnInit() {
    // 로그인한 유저 이름 정보
    this.userName$ = this.apiService.userName$

     // 클라이언트의 localStorage에 저장된 Token 값을 get
     this._info = localStorage.getItem('Auth_Token');
     console.log("Token_info >>>>> ", this._info);
     // 서버에서 Token 값을 가져오는 것이 아니라 
     // localStorage에 저장된 Token 값을 decode 해주어서
     // access.html의 _info.id, _info.name을 출력
     this._info = this.jwt.decodeToken(this._info);
     this.apiService.queryAllCars(this._info.id);
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
