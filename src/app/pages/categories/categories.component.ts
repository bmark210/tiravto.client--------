import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil, shareReplay } from 'rxjs';
import { CategoryResponse, Client } from '../../../api/client';
import { Breadcrumbs } from '../../core/interfaces/breadcrumbs';
import { SeoInterface } from '../../core/interfaces/seo';
import { BreadcrumbsService } from '../../services/breadcrumbs.service';
import { SeoService } from '../../services/http/seo.service';
import { CommonModule } from '@angular/common';
import { ChildCategoriesComponent } from './components/child-categories/child-categories.component';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/authentication/auth.service.service';
import { BaseHttpService } from '../../services/http/base-http.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ChildCategoriesComponent, CategoryItemComponent],
  providers: [BreadcrumbsService, SeoService, NotificationService, AuthService, BaseHttpService, MenuService],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {
  protected ngUnsubscribe = new Subject<void>();
  categories$: Observable<CategoryResponse[]> = new Observable();

  subIndex = -1;
  showSubs = false;
  stringKey = '';

  markForCheck() {
    this.cdr.markForCheck();
  }

  constructor(
    private client: Client,
    private breadcrumbsService: BreadcrumbsService,
    private seoService: SeoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      if (queryParams['category']) {
        this.showSubs = queryParams['sub'] ? queryParams['sub'] === 'true' : true;
        this.stringKey = queryParams['category'];
      } else {
        this.showSubs = false;
        this.stringKey = '';
      }
      this.initCategory();
    });

    this.initSeo();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initCategory(): void {
    this.categories$ = this.client.category_GetAll().pipe(
      takeUntil(this.ngUnsubscribe),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  checkSubs(): void {
    if (this.stringKey) {
      this.categories$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(categories => {
        this.subIndex = categories.findIndex(category => category.stringKey === this.stringKey);
      });
    } else {
      this.subIndex = -1;
    }
  }

  initBreadcrumbs(): void {
    this.categories$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(categories => {
      let result: Breadcrumbs = {
        title: 'Каталоги',
        url: `/catalog`,
        links: [],
        linkType: 0
      };

      if (this.stringKey && this.subIndex > -1) {
        const selectedCategory = categories[this.subIndex];
        result = {
          title: selectedCategory.title,
          url: `/catalog?category=${encodeURIComponent(selectedCategory.stringKey)}`,
          links: [result],
          linkType: 0
        };
      }

      this.breadcrumbsService.breadcrumbsStatusSource.next(result);
    });
  }

  showAllMainChanged(): void {
    this.initUrl(null, null);
  }

  initUrl(stringKey: string | null, sub: boolean | null): void {
    let url = '/catalog';
    if (stringKey) {
      url += `?category=${encodeURIComponent(stringKey)}`;
      if (sub !== null) {
        url += `&sub=${encodeURIComponent(sub.toString())}`;
      }
    }
    this.router.navigateByUrl(url);
  }

  showSubsChanged(event: boolean, index: number): void {
    this.categories$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(categories => {
      const selectedCategory = categories[index];
      if (selectedCategory) {
        this.stringKey = selectedCategory.stringKey;
        this.subIndex = index;

        if (this.checkChilds(this.subIndex)) {
          this.initUrl(selectedCategory.stringKey, true);
        } else {
          this.initProducts();
        }
      }
    });
  }

  initSeo(): void {
    const seoData: SeoInterface = {
      title: 'Каталоги',
      tags: []
    };
    this.seoService.setSeo(seoData);
  }

  checkChilds(index: number): boolean {
    let hasChild = false;
    this.categories$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(categories => {
      const category = categories[index];
      hasChild = !!(category?.child?.length);
    });
    return hasChild;
  }

  showChildProductChanged(event: string): void {
    this.stringKey = event;
    this.initProducts();
  }


  initProducts(): void {
    this.categories$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(categories => {
        const categoryIndex = categories.findIndex(category => category.stringKey === this.stringKey);
        if (categoryIndex > -1) {
          const selectedCategory = categories[categoryIndex];
          if (selectedCategory.isSale) {
            this.router.navigate(['/products/sale/'], { queryParams: { category: this.stringKey } });
          } else {
            this.router.navigate(['/products/'], {
              queryParams: {
                category: this.stringKey,
                page: 1,
                take: 20,
                minprice: 0,
                maxprice: 0,
                orderby: 0
              }
            });
          }
        } else {
          console.warn(`Category with stringKey '${this.stringKey}' not found.`);
        }
      });
  }

}
