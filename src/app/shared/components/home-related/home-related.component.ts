import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ArticleResponse } from '../../../../api/client';
import { environment } from '../../../environments/environment.dev';
import { ArrayService } from '../../../services/array.service';

@Component({
  selector: 'app-home-related',
  imports: [CarouselModule, CommonModule,],
  templateUrl: './home-related.component.html',
  styleUrl: './home-related.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeRelatedComponent {
  @Input() articles: ArticleResponse[];

  articleContainer: any;

  storagePath: string = environment.productImageUrl;
  noImageUrl: string = environment.storageUrl + environment.noPhotoUrl;
  // readonly optimizePoint: string = '/500x500/f=webp'

  pathImage: string;

    mySlideOptions = {
      dots: true,
      autoplay: true,
      loop: true,
      margin: 10,
      animateOut: 'fadeOut',
      smartSpeed: 450,
      items: 1
    };

    mySlideMobileOptions = {
      dots: true,
      autoplay: true,
      loop: false,
      margin: 10,
      animateOut: 'fadeOut',
      smartSpeed: 450,
      responsive: {
        0: {
            items: 1,
        },
        740: {
            items: 2,

        },
        1100: {
            items: 3,

        }
    }
    };

    saleMenu = true;
    newMenu = false;
    hitMenu = false;

    constructor(
      private arrayService: ArrayService,
      private router: Router
    ) { }

    ngOnInit() {
      this.articles.map(x => {
        if (x.image.length > 0) {
          x.image = this.storagePath + x.image;
        } else {
          x.image = this.noImageUrl;
        }
      });
      this.articleContainer = this.arrayService.chunck(this.articles, 3, false);

    }

    setMenus(key: string): void {
      this.resetMenus();
      if (key === 'sale') {
        this.saleMenu = true;
      }
      if (key === 'new') {
        this.newMenu = true;
      }
      if (key === 'hit') {
        this.hitMenu = true;
      }
    }

    resetMenus(): void {
      this.saleMenu = false;
      this.newMenu = false;
      this.hitMenu = false;
    }

    navigateTo(stringKey: string): void {
      window.scroll(0, 0);
      this.router.navigate([`/blog/${stringKey}`]);
    }

}
