import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ErrorCustom, errorCodes } from '../core/interfaces/error';


@Injectable()
export class ErrorService {
  error: ErrorCustom = {
    code: 200,
    title: '',
    techTitle: '',
    isVisited: true
  };
  constructor(
    private router: Router
  ) {
  }

  redirectError(code: any, title: string) {
    const index = errorCodes.codes.findIndex(x => x.code === code);
    this.error.code = code;
    this.error.techTitle = (index > -1) ? errorCodes.codes[index].info : '';
    this.error.title = title;
    this.error.isVisited = false;
    this.router.navigate(['/error']);
  }

}
