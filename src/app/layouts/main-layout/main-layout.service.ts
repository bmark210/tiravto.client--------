import { inject, Injectable } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { Client, MenuSectionResponse } from '../../../api/client';

@Injectable()
export class MainLayoutService {
  private client: Client = inject(Client);

  getMainSection(): Observable<MenuSectionResponse> {
    return this.client.menu_GetMainSection();
  }
}
