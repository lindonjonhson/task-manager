import { HttpResponse } from '@angular/common/http';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLoginButtonClicked(email: string, pw: string) {
    this.authService.login(email, pw).subscribe((res: HttpResponse<any>) => {
      console.log('Logged in');
      console.log(res);
    })
  }

}
