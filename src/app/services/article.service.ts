import { BaseHttpService } from './http/base-http.service';
import { Injectable, Inject } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { Client } from '../../api/client';

@Injectable()
export class ArticleService {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
    constructor(
        public baseHttpService: BaseHttpService,
        private client: Client
    ) {
    }

    initHOmeArticles(): Observable<any> {
      return this.client.article_GetHomeArticles();
    }

}
