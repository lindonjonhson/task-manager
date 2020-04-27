import { HttpResponse } from '@angular/common/http';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.sass']
})
export class SignupPageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignup(email: string, pw: string) {
    this.authService.signup(email, pw).subscribe((res: HttpResponse<any>) => {
      console.log('Logged in');
      console.log(res);
    });
  }

}
