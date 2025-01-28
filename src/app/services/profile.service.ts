import { Injectable } from '@angular/core';

@Injectable()
export class ProfileService {
  constructor() {}

  initFio(name: string, middlename: string, surname: string): string{
    let fio = '';
    if (surname) {
      fio = surname;
    }
    if (name) {
      fio += ' ' + name;
    }
    if (middlename) {
      fio += ' ' + middlename;
    }
    return fio;
  }
}
