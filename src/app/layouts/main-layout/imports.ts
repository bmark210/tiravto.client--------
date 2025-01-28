import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MaterialModule } from '../../shared/modules/material';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AuthService } from '../../services/authentication/auth.service.service';
import { BasketService } from '../../services/basket.service';
import { BaseHttpService } from '../../services/http/base-http.service';
import { NavigationService } from '../../services/http/navigation.service';
import { MenuService } from '../../services/menu.service';
import { NotificationService } from '../../services/notification.service';
import { StorageService } from '../../services/storage.service';
import { WishListService } from '../../services/wishlist.service';
import { MainLayoutService } from './main-layout.service';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbsService } from '../../services/breadcrumbs.service';

@NgModule({
  imports: [
    RouterOutlet,
    MaterialModule,
    NgIf,
    FooterComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    RouterModule

  ],
  exports: [
    RouterOutlet,
    MaterialModule,
    NgIf,
    FooterComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    RouterModule
  ],
  providers: [
    MainLayoutService,
    BaseHttpService,
    StorageService,
    AuthService,
    NavigationService,
    NotificationService,
    BasketService,
    MenuService,
    AuthGuard,
    WishListService,
    BreadcrumbsService,
  ],
})
export class MainLayoutModule {}
