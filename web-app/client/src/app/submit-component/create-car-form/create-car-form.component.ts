import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, Form } from '@angular/forms';
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

  constructor(private apiService: ApiService, private jwt: JwtHelperService, private http: HttpClient) { }

  ngOnInit() {
    this._info = localStorage.getItem('Auth_Token');
    // localStorage에 저장된 Token 값을 decode 해주어서
    // access.html의 _info.id, _info.name을 출력
    this._info = this.jwt.decodeToken(this._info);
  }

  // 계약서 생성
  async onSubmit(data) {
    console.log(data);
    this.onFileSubmit;
    return this.apiService.createCar(data.contract_name, data.contract_contents, data.contract_companyA, data.contract_companyB, data.contract_date, data.contract_period, this._info.id);
  }


  // 선택할 파일 변경
  onFileChange(files: FileList) {
    if (files && files.length > 0) {
      // For Preview
      const file = files[0];
      const reader = new FileReader();

      /* 브라우저는 보안 문제로 인해 파일 경로의 참조를 허용하지 않는다.
        따라서 파일 경로를 img 태그에 바인딩할 수 없다.
        FileReader.readAsDataURL 메소드를 사용하여 이미지 파일을 읽어
        base64 인코딩된 스트링 데이터를 취득한 후, img 태그에 바인딩한다. */
      reader.readAsDataURL(file);
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

    // 폼데이터를 서버로 전송한다.
    this.http.post(`http://localhost:8081/upload`, formData)
      .subscribe(res => {
        res;
      });
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
