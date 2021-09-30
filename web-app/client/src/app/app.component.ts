import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Contract';

  // 브라우저 종료/새로고침 시 localStorage token값 삭제
  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHandler(event) {
  //   localStorage.removeItem('Auth_Token');
  // }

}
