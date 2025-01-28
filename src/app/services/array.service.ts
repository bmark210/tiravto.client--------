import { Client, ProductHomePageResponse, CategoryProductFullResponse } from '../../api/client';
import { BaseHttpService } from './http/base-http.service';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ArrayService {

  constructor(
        public baseHttpService: BaseHttpService,
        private client: Client
    ) {
    }

    chunck(arr: ProductHomePageResponse[], chunkSize: number, cut: boolean = true): CategoryProductFullResponse[] {
        const groups = new Array();
        const count = Math.floor(arr.length / chunkSize);
        const lastArr = arr.slice(count * chunkSize);
        for (let i = 0; i < arr.length; i += chunkSize) {
          const model = arr.slice(i, i + chunkSize);
          if (model.length === chunkSize || i === 0 || !cut) {
            groups.push(model);
          }
        }
        if (lastArr && lastArr.length > 0) {
          groups.push(lastArr);
        }
        return groups;
    }
}
