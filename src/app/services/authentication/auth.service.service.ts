import { Router, NavigationEnd, NavigationCancel } from '@angular/router';
import { NotificationService } from '../notification.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError as observableThrowError, BehaviorSubject, Observable, Subject } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { NavigationService } from '../http/navigation.service';
import { UserProfileResponse, Client, LoginRequest } from '../../../api/client';
import { environment } from '../../environments/environment.dev';
import { IJwtItem } from "../../core/interfaces/auth/jwt-item"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  authToken: any;
  headers = new HttpHeaders();
  cachedRequests: Array<HttpRequest<any>> = [];
  apiUrl: string;
  private loggedIn = false;
  private jwtHelper: JwtHelperService;
  // Observable navItem source
  public authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this.authNavStatusSource.asObservable();

  public profileStatusSource = new BehaviorSubject<[UserProfileResponse, string]>(null);
  profileStatus$ = this.profileStatusSource.asObservable();

  backUpRoute = '';

  profile: UserProfileResponse;

  constructor(
    private http: HttpClient,
    private client: Client,
    private nagivator: NavigationService,
    private notification: NotificationService,
    private router: Router,
    @Inject('LOCALSTORAGE') private localStorage: any
  ) {

    this.jwtHelper = new JwtHelperService();
    this.apiUrl = environment.apiUrl;
    // if (this.localStorage != null) {
    //   this.loggedIn = this.localStorage.getItem('isAuth');
    // }
    if (this.isAuthenticated()) {
      if (!this.loggedIn) {
        this.loggedIn = true;
        this.authNavStatusSource.next(this.loggedIn);
      } else {
      }
    }
  }

  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }
  public retryFailedRequests(): void {
    this.cachedRequests.forEach(request => {
      request = request.clone({
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'TimeZone': `${-new Date().getTimezoneOffset}`,
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });

    });
  }

  login(loginRequest: LoginRequest) {

    this.client.account_Login(loginRequest).subscribe(data => {
      if (data && data.accessToken) {
        // this.checkLoggedIn(false);
        this.setTokens(data.accessToken.token, data.refreshToken);
        if (!this.loggedIn) {
          this.loggedIn = true;
          this.authNavStatusSource.next(this.loggedIn);
        }
        this.getProfileInfo();
        this.notification.success('Вход выполнен успешно', 'Авторизация');
         this.nagivator.nagivageTo(this.backUpRoute);
      }

    },
      error => {
        this.notification.error(error.message, 'Авторизация');
        console.error('Error', error);
      });
  }

  getProfileInfo(): void {
    this.client.profile_GetProfileInfo()
    .subscribe(data => {
      this.profile = data as UserProfileResponse;
      this.profileStatusSource.next([this.profile, this.profile.userName]);
    }, error => {
      this.notification.error('Не удалось загрузить данные пользователя', 'Ошибка');
      console.error(error);
    });
  }

  nonAuthorizeOnly(): void {
    if (this.isLoggedIn()) {
      this.nagivator.nagivageTo('/');
    }
  }


  getAccessToken(): string | null {
    if (this.localStorage != null) {
      return localStorage.getItem('accessToken');
    } else return null;
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken');
  }

  getUserRoles() {
    const userRoles = this.localStorage.getItem('currentRoles');
    const res = userRoles.split(',');
    return res;
  }

  get(url: string, sessionId: string, licenseeType: string): Observable<any> {
    this.localStorage.setItem('currentSession', sessionId);
    return this.http.get(url).pipe(
      catchError(this.handleError));
  }

  postSession(url: string, model: any): Observable<any> {
    return this.http.post(url, model).pipe(
      catchError(this.handleError));
  }

  put(url: string, model: any, sessionId: string): Observable<any> {
    return this.http.put(url, model).pipe(
      catchError(this.handleError));
  }

  delete(url: string, id: number): Observable<any> {
    return this.http.get(url + '?id=' + id).pipe(
      catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    console.error('handleError ');
    console.error(error);
    const parsedError = Object.assign({}, error, { error: JSON.stringify(error.error) });
    const formattedBody = JSON.parse(parsedError.error).message;
    return observableThrowError(formattedBody || 'Ошибка сервера');
  }

  logout() {
    // remove user from local storage to log user out
    this.clearTokens();
    this.profile = null;
    this.profileStatusSource.next([null, 'Профиль']);
    // const request = this.http.delete(this.apiUrl + '/session')
    //   .catch(this.handleError);
    // request.subscribe((response) => {
    // });
    if (this.loggedIn) {
      this.loggedIn = false;
      this.authNavStatusSource.next(this.loggedIn);
    }
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  /**
   * Проверка валидности токена
   */
  userHasValidTokens() {
    if (!this.jwtHelper.isTokenExpired(this.getAccessToken())) {
      if (this.getDecodedAccessToken()) {
        this.checkLoggedIn(false);
      } else {
        this.checkLoggedIn(true);
      }
    }
  }

  checkLoggedIn(state: boolean): boolean {
    if (this.loggedIn === state) {
      this.loggedIn = !state;
      this.authNavStatusSource.next(this.loggedIn);
      return true;
    }
    return false;
  }

  public isAuthenticated(): boolean {
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(this.getAccessToken());
  }

  getDecodedAccessToken(): IJwtItem {
    return this.jwtHelper.decodeToken(this.getAccessToken());
  }

  public setTokens(access_token: string, refresh_token: string) {
    window.localStorage.setItem('accessToken', access_token);
    window.localStorage.setItem('refreshToken', refresh_token);
  }

  clearTokens() {
    this.localStorage.removeItem('accessToken');
    this.localStorage.removeItem('refreshToken');
  }

  getRegInfo(): Observable<any> {
    return this.client.account_GetRegisterInfo();
  }

  urlListener(): void {
    this.router.events.subscribe((event) => {
      if ((event instanceof NavigationEnd || event instanceof NavigationCancel)) {
        if (this.backUpRoute !== event.url) {
          // window.scroll(0, 0);
        }
        if (event.url !== '/login') {
          this.backUpRoute = event.url;
        }
      }
    });
  }


}
