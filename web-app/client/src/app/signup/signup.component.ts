import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private apiService: ApiService, public http: HttpClient, private router: Router) { }

  ngOnInit() {
    console.log('회원가입 페이지')
  }


  async onSubmit(data) {
    await this.apiService.signUp(data.id, data.password, data.company, data.name);

    console.log(this.apiService.signUpUser$);
    if (this.apiService.signUpUser$ == 'done') {
      alert('회원가입이 완료되었습니다.');
      this.router.navigate(['/login'])
    } else {
      alert('이미 존재하는 아이디입니다.');
      this.router.navigate(['/signUp'])
    }
  }
}
