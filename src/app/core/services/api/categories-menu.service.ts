import { Injectable } from '@angular/core';
import { CategoryResponse, Client } from '../../../../api/client';
import { Observable } from 'rxjs';

@Injectable()
export class CategoriesMenuService {
  constructor(private client: Client) {}

  getAllCategories(): Observable<CategoryResponse[]> {
    return this.client.category_GetAllWithoutChild();
  }
}
