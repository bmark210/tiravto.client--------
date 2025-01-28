import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthentithicationComponent } from './pages/authentithication/authentithication.component';
import { ArticleComponent } from './pages/article/article.component';
import { BlogComponent } from './pages/blog/blog.component';
import { SubCategoryComponent } from './pages/sub-category/sub-category.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProductsComponent } from './pages/products/products.component';
import { SaleProductsComponent } from './pages/sale-products/sale-products.component';
import { ProductComponent } from './pages/product/product.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { PartnerPageComponent } from './shared/components/partner-page/partner-page.component';
import { StoComponent } from './shared/components/sto/sto.component';
import { TecDocGuard } from './core/guards/tecdoc.guard';
import { TecdocComponent } from './pages/tecdoc/tecdoc.component';
import { StoreComponent } from './pages/store/store.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: AuthentithicationComponent,
      },
      {
        path: 'blog/:stringKey',
        component: ArticleComponent,
      },
      { path: 'blog', component: BlogComponent },
      {
        path: 'category/:stringKey',
        component: SubCategoryComponent,
      },
      { path: 'catalog', component: CategoriesComponent },
      { path: 'products', component: ProductsComponent },
      {
        path: 'products/sale',
        component: SaleProductsComponent,
      },
      { path: 'category', component: SubCategoryComponent },
      {
        path: 'product/:articul',
        component: ProductComponent,
      },
      // { path: 'product' },
      { path: 'partners', component: PartnerComponent },
      {
        path: 'partners/:id',
        component: PartnerPageComponent,
      },
      { path: 'sto', component: StoComponent },
      {
        path: 'tecdoc',
        canActivate: [TecDocGuard],
        component: TecdocComponent,
      },
      // { path: 'tecdoc-catalog/:carId', canActivate: [TecDocGuard], component: TecdocCatalogComponent, pathMatch: 'full' },
      // { path: 'tecdoc-catalog', canActivate: [TecDocGuard], component: TecdocCatalogComponent, pathMatch: 'full' },
      // { path: 'profile/:tab', canActivate: [AuthGuard], component: AccountComponent, pathMatch: 'full' },
      // { path: 'profile/myorders/:index', canActivate: [AuthGuard], component: AccountComponent, pathMatch: 'full' },
      // { path: 'wishlist', canActivate: [AuthGuard], component: WishlistComponent, pathMatch: 'full' },
      // { path: 'basket', component: BasketComponent, pathMatch: 'full' },
      { path: 'contacts', component: StoreComponent, pathMatch: 'full' },
      // { path: 'payment/:status', component: PaymentComponent, pathMatch: 'full' },
      // { path: 'payment', redirectTo: 'payment/fail' },
      // { path: 'quickorder', component: QuickOrderComponent, pathMatch: 'full' },
      // { path: 'profile', redirectTo: 'profile/about' },
      // { path: 'pages/:url', component: CommonPageComponent, pathMatch: 'full' },
      // { path: 'info', component: DownloadinfoComponent, pathMatch: 'full' },
      // { path: 'info/:stringKey', component: DownloadinfoitemComponent, pathMatch: 'full' },
      // { path: 'error', component: ErrorComponent, pathMatch: 'full' },
      // { path: 'tire', component: TireComponent, pathMatch: 'full' },
      // { path: 'forgot-password', component: ForgotPasswordComponent, pathMatch: 'full' },
      // { path: 'price-online/:request', component: PriceOnlineComponent, pathMatch: 'full' },
      // { path: 'price-online', redirectTo: 'price-online/'},
      { path: '**', redirectTo: '' },
    ],
  },
];
