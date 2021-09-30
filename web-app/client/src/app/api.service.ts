import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';

const httpOptionsJson = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain',
    'Accept': 'text/plain'
  }),
};

const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });

const baseURL = `http://localhost:8081`;
const queryAllCarsURL = `/queryAllCars`;
const querySelectCarURL = `/querySelectCar`;
const createCarURL = `/createCar`;
const changeCarOwnerURL = `/changeCarOwner`;
const sendContractURL = `/sendContract`;
const makeContractURL = `/makeContract`;
const signUpURL = `/signUp`;
const loginURL = `/login`;


@Injectable()
export class ApiService {

  public cars$: Subject<Array<object>> = new BehaviorSubject<Array<object>>([]);
  public selectCars: any = new BehaviorSubject<Array<object>>([]);
  selectCars$ = this.selectCars.asObservable();
  public signUpUser$: any; // 회원 가입 시 정보
  public login$: any; // 로그인 done/false
  public token$: any; // 토큰 정보
  public user$: any;  // db에 저장된 유저 정보
  public userName$: any; // 접속 중인 유저 이름


  constructor(private http: HttpClient) {
  }


  // 회원 가입
  signUp(id: string, password: string, company: string, name: string) {
    return this.http.post(baseURL + signUpURL, ({
      'id': id,
      'password': password,
      'company': company,
      'name': name,
    }), { headers }).toPromise().then((res: any) => {
      this.signUpUser$ = res.result;
      console.log('api.server.signUpUser >>> ', this.signUpUser$)
    });
  }

  // 로그인
  login(id: string, password: string) {
    return this.http.post(baseURL + loginURL, ({
      'id': id,
      'password': password
    }), { headers }).toPromise().then((res: any) => {
      this.login$ = res.result; // done or fail
      this.token$ = res.token; // token_ifo
      this.user$ = res.user; // user_info
      this.userName$ = res.user.name;
      console.log('login$ >>>', this.login$ = res.result);
      // console.log('유저 이름 >>>', this.user$)
    });
  }

  // 계약서 작성
  createCar(contract_name: string, contract_contents: string, contract_companyA: string, contract_companyB: string, contract_date: string, contract_period: string, userName: string) {
    return this.http.post(baseURL + createCarURL, ({
      'contract_name': contract_name,
      'contract_contents': contract_contents,
      'contract_companyA': contract_companyA,
      'contract_companyB': contract_companyB,
      'contract_date': contract_date,
      'contract_period': contract_period,
      'userName' : userName
    }), { headers }).toPromise().then((result) => { this.queryAllCars(userName); });

  }

  changeCarOwner(key: string, contract_name: string, contract_contents: string, contract_companyB: string, contract_receiver: string, contract_date: string, contract_period: string, userName: string) {
    return this.http.post(baseURL + changeCarOwnerURL, { 'key': key, 'new_contract_name': contract_name, 'new_contract_contents': contract_contents, 'new_contract_companyB': contract_companyB, 'new_contract_receiver': contract_receiver, 'new_contract_date': contract_date, 'new_contract_period': contract_period , 'userName' : userName },
      { headers }).toPromise().then((result) => { this.queryAllCars(userName); });
  }

  // 유저에 따른 목록 표시
  queryAllCars(userName: string) {
    return this.http.post<Array<any>>(baseURL + queryAllCarsURL, {'userName': userName},{headers}).subscribe((response) => {
      this.cars$.next(response);
      console.log(response);
    });
  }

  // 계약서 상세 조회
  querySelectCar(key: string, userName: string) {
    console.log("key >>> ", key);

    return this.http.post(baseURL + querySelectCarURL, { 'key': key , 'userName' : userName },
      { headers }).toPromise().then((result: any) => {
        result.key = key
        this.selectCars.next(result); console.log(this.selectCars);
      });
  }

  // 계약서 전송 (갑 > 을)
  sendContract(key: string, contract_signA: string, contract_receiver: string, changeState: string, userName: string) {
    return this.http.post(baseURL + sendContractURL, { 'key': key, 'contract_signA': contract_signA, 'contract_receiver': contract_receiver, 'changeState': changeState , 'userName' : userName },
      { headers }).toPromise().then((result) => { this.queryAllCars(userName); });
  }

  // 계약서 최종 서명 (을)
  makeContract(key: string, contract_signB: string, changeState: string, userName: string) {
    return this.http.post(baseURL + makeContractURL, { 'key': key, 'contract_signB': contract_signB, 'changeState': changeState , 'userName' : userName },
      { headers }).toPromise().then((result) => { this.queryAllCars(userName); });
  }
}
