import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Breadcrumbs, BreadcrumbsLinked } from '../../../core/interfaces/breadcrumbs';
import { BreadcrumbsService } from '../../../services/breadcrumbs.service';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-breadcrumbs',
  imports: [CommonModule, RouterLink, NzMenuModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
  // protected ngUnsubscribe: Subject<void> = new Subject<void>();
  // breadcrumbs: Breadcrumbs;
  // isShow = false;

  // constructor(
  //   private router: Router,
  //   private menuSerevice: MenuService,
  //   private breadcrumbsService: BreadcrumbsService,
  //   private cdr: ChangeDetectorRef
  //   // private notify: NotificationService
  // ) { }

  // ngOnInit() {
  //   this.breadcrumbsService.breadcrumbsStatus$
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(data => {
  //       this.breadcrumbs = data as Breadcrumbs;
  //     });
  //   this.menuSerevice.homeStatus$
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(state => { this.isShow = !state; });
  //   this.breadcrumbsService.breadcrumbsFinalStatus$
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(data => {
  //       if (data) {
  //         const model = data[0] as Breadcrumbs;
  //         if (this.breadcrumbs && this.breadcrumbs.links && !data[1]) {
  //           this.breadcrumbs.links.concat(model.links);
  //           this.breadcrumbs.title = model.title;
  //           this.breadcrumbs.url = model.url;
  //         } else {
  //           const result: Breadcrumbs = {
  //             title: model.title,
  //             url: model.url,
  //             links: model.links,
  //             linkType: model.linkType
  //           };
  //           this.breadcrumbs = result as Breadcrumbs;
  //         }
  //       }
  //     });
  //   this.breadcrumbsService.breadcrumbsCategoryStatus$
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(data => {
  //       const model = data as Breadcrumbs;
  //       if (this.breadcrumbs) {
  //         const oldEnd: BreadcrumbsLinked = {
  //           title: this.breadcrumbs.title,
  //           url: this.breadcrumbs.url,
  //           linkType: this.breadcrumbs.linkType
  //         };
  //         this.breadcrumbs.links.push(oldEnd);
  //         this.breadcrumbs.title = model.title;
  //         this.breadcrumbs.url = model.url;
  //       }
  //     });
  // }

  // ngOnDestroy(): void {
  //   this.ngUnsubscribe.next();
  //   this.ngUnsubscribe.complete();
  // }

  // navigateTo(url: string, index: number, linkType: number): void {
  //   //     window.scrollTo({
  //   //   top: 0,
  //   //   left: 0,
  //   //   behavior: 'smooth'
  //   // });
  //   const model = this.breadcrumbs;
  //   model.links.splice(index + 1, this.breadcrumbs.links.length - index + 1);
  //   model.title = this.breadcrumbs.links[index].title;
  //   model.url = this.breadcrumbs.links[index].url;
  //   model.links.splice(index, 1);
  //   this.breadcrumbs = model;
  //   window.scroll(0, 0);
  //   switch (linkType) {
  //     case 444:
  //       this.menuSerevice.basketClickSource.next(true);
  //       break;
  //     case 0:
  //       this.router.navigate([url]);
  //       break;
  //     case 1:
  //       if (url === environment.categoryMain) {
  //         this.router.navigate([url]);
  //       } else {
  //         this.router.navigate([`/products/`], { queryParams: { category: url, page: 1, take: 20, minprice: 0, maxprice: 0, orderby: 0 } });
  //       }
  //       break;
  //     case 2:
  //       if (url === environment.categoryMain) {
  //         this.router.navigate([url]);
  //       } else {
  //         this.router.navigate([`/catalog/`], { queryParams: { category: url } });
  //       }
  //       break;
  //   }
  // }
}
