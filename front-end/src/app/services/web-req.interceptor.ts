import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  refreshingAccessToken: boolean;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handle the request
    request =  this.addAuthHeader(request);

    // call next and handle response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401 && !this.refreshingAccessToken) {
          // 401 means unathorized, so we logoff
          return this.refreshAccessToken()
            .pipe(
              switchMap(() => {
                request = this.addAuthHeader(request);
                return next.handle(request);
              }),
              catchError((err: any) => {
                console.log(err);
                this.authService.logout();
                return empty();
              })
            );
        }
        return throwError(error);
      })
    );
  }

  refreshAccessToken() {
    this.refreshingAccessToken = true;
    // Call a method in the auth service to send a request to refresh the access token
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        this.refreshingAccessToken = false;
        console.log('Access Token Refreshed');
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
