import { BaseHttpService } from './http/base-http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class StoService {

    constructor(
        public baseHttpService: BaseHttpService,
    ) {
    }

    postStoSub(model: any): Observable<any>{
        return this.baseHttpService.post("/stosub", model);
    }

}
