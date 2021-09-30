import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuardService, AuthRedirect } from './services/auth-guard.service';

import { AppComponent } from './app.component';
import { QueryAllCarsComponent } from './query-all-cars/query-all-cars.component';
import { ApiService } from './api.service';
import { CreateCarFormComponent } from './submit-component/create-car-form/create-car-form.component';
import { SubmitComponent } from './submit-component/submit.component';
import { AppRoutingModule } from './app.router.module';
import { ContractCompanyAComponent } from './contract-company-a/contract-company-a.component';
import { ContractCompanyBComponent } from './contract-company-b/contract-company-b.component';
import { MainComponent } from './main/main.component';
import { ReadContractComponent } from './read-contract/read-contract.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModifyContractComponent } from './modify-contract/modify-contract.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';



export function tokenGetter() {
  return localStorage.getItem('Auth_Token');
}

@NgModule({
  declarations: [
    AppComponent,
    QueryAllCarsComponent,
    CreateCarFormComponent,
    SubmitComponent,
    ContractCompanyAComponent,
    ContractCompanyBComponent,
    ReadContractComponent,
    MainComponent,
    ModifyContractComponent,
    LoginComponent,  
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // 허용되지 않는 경로 설정
        // 특정 경로에 대한 인증 헤더를 바꾸지 않으려면 나열
        disallowedRoutes: [
					'/main',
					'/signup',
				]
      }  
    }),
  ],
  providers: [ApiService, AuthGuardService, AuthRedirect],
  bootstrap: [AppComponent]
})
export class AppModule { }

