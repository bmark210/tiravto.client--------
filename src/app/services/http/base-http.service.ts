
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service.service';
import { OrderReportRequest } from '../../../api/client';

@Injectable()
export class BaseHttpService {
  authToken: any;
  headers = new HttpHeaders();
  apiUrl: string;
  cardUrl: string;

  constructor(private http: HttpClient,
    @Inject('LOCALSTORAGE') private localStorage: any,
    public authService: AuthService
  ) {

    if (this.localStorage != null) {
      this.authToken = this.localStorage.getItem('accessToken');
    }
    this.apiUrl = 'AppConfig.apiUrl';
  }

  getCardInfo(bin: string): Observable<any> {
    const resultUrl = this.cardUrl + bin;
    return this.http.get(resultUrl).pipe(
      catchError(this.handleError));
  }

  get(url: string): Observable<any> {
    const resultUrl = this.apiUrl + url;
    return this.http.get(resultUrl).pipe(
      catchError(this.handleError));
  }

  getFile(url: string) {
    const resultUrl = this.apiUrl + url;
    return this.http.get(resultUrl, { responseType: 'blob' }).pipe(
    catchError(this.handleError));

  }

  post(url: string, model: any, options: any= null): Observable<any> {
    const resultUrl = this.apiUrl + url;
    if (options != null) {
    return this.http.post(resultUrl, model, options).pipe(
    catchError(this.handleError));
    }
    return this.http.post(resultUrl, model).pipe(
    catchError(this.handleError));
  }

  postFile(url: string, model: any): Observable<any> {
    const resultUrl = this.apiUrl + url;
    // headers.append('enctype', 'application/x-www-form-urlencoded');
    // headers.append('Accept', 'application/x-www-form-urlencoded');
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // let body = JSON.stringify(model);
    return this.http.post(resultUrl, model).pipe(
      catchError(this.handleError));
  }
  put(url: string, model: any, options: any= null): Observable<any> {
    const resultUrl = this.apiUrl + url;
    if (options != null) {
    return this.http.put(resultUrl, model, options).pipe(
      catchError(this.handleError));
    }
    return this.http.put(resultUrl, model).pipe(
    catchError(this.handleError));
  }

  delete(url: string): Observable<any> {
    const resultUrl = this.apiUrl + url;
    return this.http.delete(resultUrl).pipe(
      catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
      if (error.status === 401 && !this.localStorage) {
        location.reload();
      }
      const parsedError = Object.assign({}, error, { error: JSON.stringify(error.error || 'Ошибка сервера') });
      const formattedBody  = JSON.parse(parsedError.error).message;
      return observableThrowError(formattedBody);
  }

  getWithoutCache(url: string): Observable<any> {
    const resultUrl = this.apiUrl + url;
    return this.http.get(resultUrl, { headers: this.headers }).pipe(
      catchError(this.handleError));
  }

  downloadReport(request: OrderReportRequest) {
    // return this.http.post<Blob>(`${AppConfig.apiUrl}/orders/download`, request,
    //   { responseType: 'blob' as 'json' });
  }
}
