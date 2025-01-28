import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../authentication/auth.service.service';
import { Title, Meta } from '@angular/platform-browser';
import { SeoInterface, TagsInterface } from '../../core/interfaces/seo';

@Injectable()
export class SeoService {
    //authToken: any;
    headers = new HttpHeaders();

    currentSeo: SeoInterface;
    newSeo: SeoInterface;

    constructor(
        private http: HttpClient,
        @Inject('LOCALSTORAGE') private localStorage: any,
        public authService: AuthService,
        private title: Title,
        private meta: Meta
    ) {
        // if (this.localStorage != null) {
        //     this.authToken = this.localStorage.getItem('currentSession');
        // }
    }

    setSeo(seo: SeoInterface ): void {
        this.newSeo = seo as SeoInterface;
        this.replaceSeo();
    }

    replaceSeo(): void {
      if (this.currentSeo) {
        this.removeMeta(this.currentSeo);
      }
      this.currentSeo = this.newSeo;
      if (this.newSeo) {
        this.setMeta(this.newSeo);
      } else {
        this.defaultSeo();
      }
    }

    setTitle(title: string): void {
        this.title.setTitle(title);
    }

    setMeta(seo: SeoInterface): void {
        this.setTitle(seo.title);
        for (let i = 0; i < seo.tags.length; i++) {
          this.meta.addTag({ name: seo.tags[i].name, content: seo.tags[i].content });
        }
    }

    removeMeta(seo: SeoInterface): void {
      for (let i = 0; i < seo.tags.length; i++) {
        this.meta.removeTag(`name="${seo.tags[i].name}"`);
      }
    }

    updateTag(seo: SeoInterface): void {
      for (let i = 0; i < seo.tags.length; i++) {
        this.meta.updateTag({ name: seo.tags[i].name, content: seo.tags[i].content });
      }
    }

    defaultSeo(): void {
      const modelSeo: TagsInterface[] = [{
        name: 'Description',
        content: 'Интернет магазин автозапчастей'
      },
      {
        name: 'Keywords',
        content: 'Автозапчасти'
      }];
      const resultSeo: SeoInterface = {
        title: 'ТирАвто',
        tags: modelSeo
      };
      this.setSeo(resultSeo);
    }
}
