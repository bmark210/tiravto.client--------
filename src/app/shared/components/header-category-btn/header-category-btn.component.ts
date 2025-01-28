import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  CategoryResponse,
  SettingActiveResponse,
  Client,
} from '../../../../api/client';
import { environment } from '../../../environments/environment.dev';
import { AuthService } from '../../../services/authentication/auth.service.service';
import { MenuService } from '../../../services/menu.service';
import { MaterialModule } from '../../modules/material';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
// import {data} from './data';
import { PreventMenuCloseDirective } from '../../directives/prevent-menu-close.directive';
import { CategoriesMenuService } from '../../../core/services/api/categories-menu.service';
// import { MatMenuHoverDirective } from 'ngx-mat-menu-hover';

@Component({
  selector: 'app-header-category-btn',
  imports: [
    CommonModule,
    RouterLink,
    MaterialModule,
    PreventMenuCloseDirective,
  ],
  providers: [CategoriesMenuService],
  templateUrl: './header-category-btn.component.html',
  styleUrl: './header-category-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderCategoryBtnComponent {
  @ViewChild(MatMenuTrigger) mainMenu!: MatMenuTrigger;

  opened(event: boolean): void {
    console.log('Menu opened:', event);
  }

  closed(): void {
    console.log('Menu closed:');
  }

  isSlicedMenu: boolean = true;
  menus: { [key: string]: MatMenu } = {};

  openMenu(): void {
    if (this.mainMenu) {
      this.mainMenu.openMenu();
    }
  }

  hideMenu(): void {
    if (this.mainMenu) {
      this.mainMenu.closeMenu();
    }
  }

  // ngAfterViewInit(): void {

  //   this.mainMenu.

  //   if (menuPanel) {
  //     // Clone the element (true ensures deep cloning, including child elements)
  //     const clonedMenuPanel = menuPanel.cloneNode(true) as HTMLElement;

  //     // Optionally, modify the cloned element (e.g., add classes, change attributes, etc.)
  //     clonedMenuPanel.classList.add('cloned-menu-panel');

  //     // Append it to another part of the DOM
  //     const targetContainer = document.querySelector('.width-284'); // Replace with your target container selector
  //     if (targetContainer) {
  //       targetContainer.appendChild(clonedMenuPanel);
  //       menuPanel.remove();
  //     } else {
  //       console.error('Target container not found.');
  //     }
  //   } else {
  //     console.error('Menu panel not found.');
  //   }
  // }

  // Example method to generate query params

  // Example method for menu tracking

  // @Input() categories: CategoryResponse[] = [];
  @Input() settingBool: SettingActiveResponse;
  @Input() isSticky: boolean;
  isShow = false;
  isHome = false;
  countShow = 13;
  parentImage = '';
  pathImage = environment.productImageUrl;
  parentCategory: CategoryResponse;
  timeoutHandle: any;
  timeoutParentHandle: any;
  displayedCategories: CategoryResponse[] = [];
  childCategories: CategoryResponse[] = [];
  isReady = false;
  isLogin = false;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  currentPath: string = ''

  constructor(
    private menuService: MenuService,
    private router: Router,
    private client: Client,
    private auth: AuthService,
    private categoryMenu: CategoriesMenuService,
  ) {}

  ngOnInit() {
    // this.homePageListener();
    // this.settingBoolListener();
    this.getParentCategories();
    // this.getAuthStatus();

  }

  saveMenu(menu: MatMenu, id: string): void {
    this.menus[id] = menu;
  }

  getMenu(id: string): MatMenu {
    return this.menus[id];
  }

  getTrigger(menuId: string): string {
    return menuId;
  }

  getParams(stringKey: string) {
    return {
      category: stringKey,
      page: 1,
      take: 20,
      minprice: 0,
      maxprice: 0,
      orderby: 0,
    };
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // getTrigger(i: number): MatMenu {
  //   return vertebrates as MatMenu;
  // }

  // getAuthStatus(): void {
  //   this.auth.authNavStatus$
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe((value) => {
  //       this.isLogin = value;
  //     });
  // }

  getParentCategories(): void {
    this.categoryMenu.getAllCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.displayedCategories = response;
        console.log(response);

        // this.countShow = this.getMinCount();
      });
  }

  // parentChanged(index: number, id: string): void {
  //   this.client.category_GetChildsByParentId(id).subscribe((data) => {
  //     this.childCategories = data;
  //     this.resetParentTimeOut();
  //     this.parentCategory = null;
  //     if (this.displayedCategories[index]) {
  //       this.parentImage =
  //         this.pathImage + this.displayedCategories[index].image;
  //       this.parentCategory = this.displayedCategories[index];
  //     }
  //   });
  // }

  // settingBoolListener(): void {
  //   this.menuService.settingBoolStatus$
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe((data) => {
  //       if (data) {
  //         this.settingBool = data as SettingActiveResponse;
  //         if (this.countShow !== this.displayedCategories.length) {
  //           this.countShow = this.getMinCount();
  //         } else {
  //           this.isReady = true;
  //         }
  //       }
  //     });
  // }

  // getMinCount(): number {
  //   if (this.settingBool) {
  //     if (!this.isReady) {
  //       this.isReady = true;
  //     }
  //     return this.settingBool.tecDoc ? 12 : 13;
  //   } else {
  //     return 13;
  //   }
  // }

  // homePageListener(): void {
  //   this.menuService.homeStatus$
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe((state) => {
  //       this.isHome = state;
  //       this.isShow = this.isSticky ? false : state;
  //       if (this.isHome) {
  //         this.resetTimeOut();
  //         if (!this.isSticky) {
  //           this.countShow = this.getMinCount();
  //         }
  //       } else {
  //         this.countShow = this.displayedCategories.length;
  //       }
  //     });
  // }

  // showAllCategories(): void {
  //   this.countShow =
  //     this.countShow === this.displayedCategories.length
  //       ? this.getMinCount()
  //       : this.displayedCategories.length;
  // }

  // changeMenuState(state: boolean): void {
  //   if (this.isHome && !this.isSticky && this.isShow) {
  //     return;
  //   }
  //   this.isShow = state;
  // }

  // setTimeOut(): void {
  //   if (this.timeoutHandle) {
  //     window.clearTimeout(this.timeoutHandle);
  //   }
  //   if (this.isHome) {
  //     return;
  //   }
  //   this.timeoutHandle = window.setTimeout(() => {
  //     this.isShow = false;
  //     this.parentCategory = null;
  //     this.childCategories = [];
  //   }, 1000);
  // }

  // resetTimeOut(): void {
  //   if (this.timeoutHandle) {
  //     window.clearTimeout(this.timeoutHandle);
  //   }
  // }

  // setParentTimeOut(): void {
  //   if (this.timeoutParentHandle) {
  //     window.clearTimeout(this.timeoutParentHandle);
  //   }
  //   this.timeoutParentHandle = window.setTimeout(() => {
  //     this.parentCategory = null;
  //     this.childCategories = [];
  //   }, 1000);
  // }

  // resetParentTimeOut(): void {
  //   if (this.timeoutParentHandle) {
  //     window.clearTimeout(this.timeoutParentHandle);
  //   }
  // }

  // openTecDoc(): void {
  //   window.scroll(0, 0);
  //   this.router.navigate([`/tecdoc`]);
  // }

  // closeMenu(): void {
  //   this.parentCategory = null;
  //   this.childCategories = [];
  //   if (this.isHome && !this.isSticky) {
  //     return;
  //   }
  //   this.isShow = false;
  // }
}
