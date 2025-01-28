import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuSectionResponse } from '../../../api/client';
import { MainLayoutService } from './main-layout.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MainLayoutModule } from './imports';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@UntilDestroy()
@Component({
  selector: 'app-main-layout',
  imports: [MainLayoutModule, RouterModule, NzIconModule, NzMenuModule, NzLayoutModule],
  providers: [],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {

  hasSidebar = false;
  private resizeObserver!: ResizeObserver;

  ngOnInit(): void {
    this.checkScreenSize(); // Check initially
    this.initResizeObserver(); // Add listener for resize
    this.initMenues();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect(); // Clean up observer on destroy
  }

  private checkScreenSize(): void {
    this.hasSidebar = window.innerWidth < 768; // Mobile threshold
  }

  private initResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.checkScreenSize();
    });
    this.resizeObserver.observe(document.body);
  }

  isCollapsed = false;

  menues: MenuSectionResponse = {};
  countMainCategory = 0;
  isReady = true;

  headerFixed = false;

  constructor(
    private mainLayoutApi: MainLayoutService,
    private activatedRoute: ActivatedRoute,
  ) // private seoService: SeoService,
  // private menuService: MenuService,
  // public notificationService: NotificationService,
  // private client: Client,
  // private spinner: NgxSpinnerService,
  //   private route: ActivatedRoute
  {
    this.activatedRoute.queryParams.subscribe((x) => {
      console.log(x, 'here is route param');

    })
    // this.seoService.defaultSeo();
    // this.eventSubscription = fromEvent(window, 'scroll')
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(e => {
    //     this.headerFixed = window.scrollY >= this.offSetHeader;
    // });
  }

  // spinnerShow(): void {
  // this.menuService.spinnerStatus$
  //   .pipe(takeUntil(this.ngUnsubscribe))
  //   .subscribe((data: any) => {
  //     if (data) {
  //       this.spinner.show();
  //       this.spinnerActive = true;
  //     } else {
  //       this.timeoutSpinnerHandle = window.setTimeout(() => {
  //           this.spinner.hide();
  //           this.spinnerActive = false;
  //         },
  //         200);
  //       this.spinnerActive = false;
  //     }
  //   });
  // }

  // spinnerShow(): void {
  //   this.loader.progress$.pipe()
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(data => {
  //       if (data > 0 && data < 100) {
  //         if (!this.spinnerActive) {
  //           this.spinner.show();
  //           this.spinnerActive = true;
  //           this.resetTimeOut();
  //         }
  //       } else {
  //         if (this.spinnerActive) {
  //           this.spinner.hide();
  //           this.spinnerActive = false;
  //         }
  //       }
  //     });
  // }

  // setTimeOut(): void {
  //   if (this.timeoutSpinnerHandle) {
  //     window.clearTimeout(this.timeoutSpinnerHandle);
  //   }
  // this.timeoutSpinnerHandle = window.setTimeout(() => {
  //     this.spinner.hide();
  //     this.spinnerActive = false;
  //   },
  //   200);
  // }

  // resetTimeOut(): void {
  //   if (this.timeoutSpinnerHandle) {
  //     window.clearTimeout(this.timeoutSpinnerHandle);
  //   }
  // }

  // ngOnInit(): void {
    //   this.spinnerShow();
    //   this.initSettings();
    //   this.sideNav();
    // if (this.authService.isLoggedIn()) {
    //   this.authService.getProfileInfo();
    // } else {
    //   this.profile = null;
    //   this.authService.profileStatusSource.next([null, 'Профиль']);
    // }
    // this.headerFixed = window.pageYOffset >= this.offSetHeader;
    // this.initCategories();

    // this.initTimer();

    // this.authService.authNavStatus$
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((state: any) => {
    //     if (state) {
    //       this.authService.getProfileInfo();
    //     } else {
    //       this.profile = null;
    //       this.authService.profileStatusSource.next([null, 'Профиль']);
    //       this.menuService.balanceStatusSource.next(0);
    //     }
    //   });
  // }

  // initSettings(): void {
  //   this.client.setting_GetCommonSettings()
  //     .pipe(takeUntil(this.ngUnsubscribe))
  // .subscribe(data => {
  //   this.menuService.siteSettings = data as SettingsResponse;
  //   this.menuService.settingsReadySource.next(true);
  // }, error => {
  //   console.error(error);
  // });
  // }

  // initTimer() {
  //   if (this.timerStopped === false) {
  //     return;
  //   }
  //   this.timerStopped = false;
  //   this.timemerSubscribe = timer(0, 300000)
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(t => {
  // if (this.authService.isLoggedIn()) {
  //   this.client.profile_NewMessagesCount()
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(count => {
  //       this.notificationService.messageCountStatusSource.next(count);
  //     }, error => {
  //       console.error(error);
  //     });
  // }
  // this.client.setting_GetCommonBool()
  //   .pipe(takeUntil(this.ngUnsubscribe))
  //   .subscribe(data => {
  //     this.menuService.settingBool = data as SettingActiveResponse;
  //     this.menuService.settingBoolStatusSource.next(data);
  //   }, error => {
  //     console.error(error);
  //   });
  //     });
  // }

  // stopTimer() {
  //   if (this.timerStopped === false) {
  //     this.timemerSubscribe.unsubscribe();
  //     this.timerStopped = true;
  //   }
  // }

  // public ngOnDestroy(): void {
  //   this.unsubscribe.next();
  //   this.unsubscribe.complete();
  //   this.stopTimer();
  // this.spinner.hide();
  // }

  // sideNav(): void {
  // this.menuService.sideNavStatus$
  //   .pipe(takeUntil(this.unsubscribe))
  //   .subscribe((state: any) => {
  //     if (state) {
  //       this.drawer.toggle();
  //     }
  //   });
  // }

  initMenues(): void {
    this.mainLayoutApi
      .getMainSection()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          this.menues = data as MenuSectionResponse;
          console.log(this.menues, 'menues');

          this.isReady = true;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
