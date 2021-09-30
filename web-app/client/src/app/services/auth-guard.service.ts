import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router'
import { UserService } from './user.service'


// 토큰이 없는 경우
@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate, OnInit {

	private accessTokenName = 'Auth_Token';

	constructor(private loginService: UserService, private router: Router) { }

	ngOnInit() { 
		console.log('auth redirect oninit'); 
	}

	// import한 canActivate() 를 사용하여 토큰이 없으면 Router
	canActivate(): boolean {
		if (!localStorage.getItem(this.accessTokenName)) {
			// alert('Token이 없는 상태! login으로 이동...');
			alert('로그인 해주세요');
			this.router.navigate(['/login']);
			return false;
		}
		return true;
	}
}


// 토큰이 있는 경우
@Injectable()
export class AuthRedirect implements CanActivate, OnInit {

	private accessTokenName = 'Auth_Token';

	constructor(private router: Router, private loginService: UserService) { }

	ngOnInit() { 
		console.log('auth redirect oninit'); 
	}

	// import한 canActivate() 를 사용하여 토큰이 있으면 Router
	canActivate(): boolean {
		// 실제로는 아래와 같이 auth 처리. 임시로 일단 존재여부만 확인.
		// if (!this.auth.isAuthenticated()) {
		if (localStorage.getItem(this.accessTokenName)) {
			// alert('이미 로그인 된 상태! access로 이동...');
			alert('이미 로그인 중입니다.')
			this.router.navigate(['/main']);
			return false;
		} else {
			return true;
		}
	}
}