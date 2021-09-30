import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router, private auth: UserService) { }

  ngOnInit() {
  }

  async onSubmit(data) {
    await this.apiService.login(data.id, data.password)
    if (this.apiService.login$ == 'login_done') {
      console.log('author >>>>> ', this.apiService.user$.author)
      // admin page 라우팅
      if (this.apiService.user$.author == 'admin') {
        this.router.navigate(['/main'])
        localStorage.setItem("Auth_Token", this.apiService.token$);
      }
      // user page 라우팅
      else {
        this.router.navigate(['/main'])
        localStorage.setItem("Auth_Token", this.apiService.token$);
      }
    } else {
      alert('아이디 혹은 비밀번호 오류입니다.');
      this.router.navigate(['/login'])
    }
  }
}