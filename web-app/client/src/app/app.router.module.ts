import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractCompanyAComponent } from './contract-company-a/contract-company-a.component';
import { ContractCompanyBComponent } from './contract-company-b/contract-company-b.component';
import { MainComponent } from './main/main.component';
import { ModifyContractComponent } from './modify-contract/modify-contract.component';
import { ReadContractComponent } from './read-contract/read-contract.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuardService, AuthRedirect } from './services/auth-guard.service';



const routes: Routes = [

  // 첫 화면을 login 페이지로 설정
  { path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [AuthRedirect] // 경로가드는 사용자가 진입할 수 없는 영역에 진입하는 것을 방지
  },
  { 
    path: 'signUp', 
    component: SignupComponent,
    canActivate: [AuthRedirect]
  },
  { 
    path: 'main', 
    component: MainComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'contractA', 
    component: ContractCompanyAComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'contractB', 
    component: ContractCompanyBComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'readContract', 
    component: ReadContractComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'modifyContract', 
    component: ModifyContractComponent,
    canActivate: [AuthGuardService]
  },

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
