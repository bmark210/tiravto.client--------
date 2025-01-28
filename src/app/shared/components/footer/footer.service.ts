import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client, FooterResponse, SocialNetworkResponse, StoreResponse } from '../../../../api/client';
import { Observable } from 'rxjs';

@Injectable()
export class FooterService {
  private client: Client = inject(Client);

  getFooter(): Observable<StoreResponse[]> {
    return this.client.store_GetFooter();
  }

  getSocialNetworks(): Observable<SocialNetworkResponse[]> {
    return this.client.setting_GetSocialNetworks();
  }

  getFooterInfo(): Observable<FooterResponse> {
    return this.client.setting_GetFooterInfo();
  }
}