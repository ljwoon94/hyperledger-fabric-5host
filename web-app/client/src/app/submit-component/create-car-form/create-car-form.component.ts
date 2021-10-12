import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, Form, FormBuilder, FormGroup } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-create-car-form',
  templateUrl: './create-car-form.component.html',
  styleUrls: ['./create-car-form.component.scss']
})
export class CreateCarFormComponent implements OnInit {

  private _info: any;
  loading = false;
  private _formData: any;
  uploadForm: FormGroup;  
  constructor(
    private apiService: ApiService, 
    private jwt: JwtHelperService, 
    private http: HttpClient, 
    private formBuilder: FormBuilder
  ) { 

  }

  ngOnInit() {
    this._info = localStorage.getItem('Auth_Token');
    // localStorage에 저장된 Token 값을 decode 해주어서
    // access.html의 _info.id, _info.name을 출력
    this._info = this.jwt.decodeToken(this._info);
    
    
    this.uploadForm = this.formBuilder.group({
      contract_file: ['']
    });
  }

  // 계약서 생성
  async onSubmit(data) {
    console.log(data);
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('contract_file').value);
    formData.append('contract_name', data.contract_name);
    formData.append('contract_contents', data.contract_contents);
    formData.append('contract_companyA', data.contract_companyA);
    formData.append('contract_companyB', data.contract_companyB);
    formData.append('contract_date', data.contract_date);
    formData.append('contract_period', data.contract_period);
    formData.append('userName', this._info.id);
    console.log(formData.get('file'));
    console.log(formData.get('contract_name'));
    this.http.post(`http://localhost:8081/createCar`, formData)
      .subscribe(res => {
        res;
        this.apiService.queryAllCars(this._info.id);
      });
    //return this.apiService.createCar(data.contract_name, data.contract_contents, data.contract_companyA, data.contract_companyB, data.contract_date, data.contract_period, this._info.id, this._formData);
  
  }


  // 선택할 파일 변경
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.uploadForm.get('contract_file').setValue(file);
    }
  }

  // 파일 업로드
  onFileSubmit(files: FileList) {
    if(!this.validateFile(files[0].name)){
      alert('Selected file format is not supported');
      return false;
    }
    const formData = new FormData();
    formData.append('file', files[0]);
    this.loading = true;
    // Send data (payload = formData)
    console.log(formData.get('file'));
  
  }

  // 유효성 검사
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'pdf') {
      return true;
    }
    else {
      return false;
    }
  }

  

}
