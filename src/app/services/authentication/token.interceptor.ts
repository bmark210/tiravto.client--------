import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service.service';
import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  authToken: any;
  public jwtService: JwtHelperService;
  constructor(
    @Inject('LOCALSTORAGE') private localStorage: any,
    public authService: AuthService,
  ) {
    this.jwtService = new JwtHelperService();
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.authToken = this.authService.getAccessToken();
    if (this.authToken) {
      if (this.jwtService.isTokenExpired(this.authToken)) {
        // TODO: redirect to refresh method

      } else {
        const jwtDecoded = this.jwtService.decodeToken(this.authToken) as IJwtItem;
      }
    } else {
      this.authService.logout();
      // TODO: redirect to auth
    }

    request = request.clone({
      setHeaders: {
        'TimeZone': `${-new Date().getTimezoneOffset()}`,
        Authorization: `Bearer ${this.authToken}`,
      }
    });
    return next.handle(request).pipe(tap(event => {
    }, (error: HttpErrorResponse) => {
    }));
  }
}
