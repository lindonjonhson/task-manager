import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handle the request
    request =  this.addAuthHeader(request);

    // call next and handle response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  addAuthHeader(request: HttpRequest<any>) {
    // get access token
    const token = this.authService.getAccessToken();

    if (token) {
      // append it to the request header
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }

    return request;
  }
}
