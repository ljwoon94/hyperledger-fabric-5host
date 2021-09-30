import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http:HttpClient, private jwt: JwtHelperService) { }

  // Angular Data Form 
  // 서버에 로그인 요청
  login(loginInfo:any){
    return this.http.post('/login', loginInfo);
  }

  // Token 확인
  // toekn validation
	isAuthenticated(): boolean {
    const token = localStorage.getItem('Auth_Token');
    console.log("isAuthenticated >>> ",token)
    // isTokenExpired가 True이기 때문에 만료된 토큰을 사용할 수 있다고 판단
    // 그러니 만료된 토큰을 사용할 수 없게 !로 바꿔준다.
		return token ? !this.isTokenExpired(token) : false;
	}

  // 토큰이 만료되지 않았는지 확인
  // 토큰이 만료됐으면 true, 만료되지 않았으면 false
  isTokenExpired(token: string) {
		return this.jwt.isTokenExpired(token);
	}

}
