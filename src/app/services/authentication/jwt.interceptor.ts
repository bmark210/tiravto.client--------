import { JwtHelperService } from '@auth0/angular-jwt';
import { ExchangeRefreshTokenRequest, ExchangeRefreshTokenResponse } from './../Client';
import { AuthService } from './auth.service.service';
import {
  HttpResponse,
  HttpErrorResponse,
  HttpRequest, HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Client } from '../Client';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public jwtService: JwtHelperService;
  constructor(public auth: AuthService,
    private client: Client) {
    this.jwtService = new JwtHelperService();
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).
    pipe(tap(x => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want

      }

    // do((event: HttpEvent<any>) => {
    //   if (event instanceof HttpResponse) {
    //     // do stuff with response if you want
    //
    //   }
    }, (err: any) => {
      console.warn('JwtInterceptor');
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.error('!!! 401 !!!');
          // redirect to the login route
          // or show a modal
          this.auth.collectFailedRequest(request);
          if (this.jwtService.isTokenExpired(this.auth.getAccessToken()) && this.auth.getRefreshToken()) {
            const tokenReq: any = {
              accessToken: this.auth.getAccessToken(),
              refreshToken: this.auth.getRefreshToken()
            };

            this.client.account_RefreshToken(tokenReq).subscribe(data => {
              if (data && data.accessToken) {
                this.auth.setTokens(data.accessToken.token, data.refreshToken);
                this.auth.retryFailedRequests();
              }
            },
              error => {
                console.error('JWT token not set.');
                console.error('Error', error);
                this.auth.logout();
              });
          } else {
            this.auth.logout();
          }
        }
      }
    }))
  }
}

