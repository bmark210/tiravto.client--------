import { BaseHttpService } from './http/base-http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ContactService {

    constructor(
        public baseHttpService: BaseHttpService,
    ) {
    }

    postContactUs(model: any): Observable<any> {
        return this.baseHttpService.post('/contactus', model);
    }

}
