import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { USER_REDUCER } from './store/reducers/user.reducer';
import { BASKET_REDUCER } from './store/reducers/basket.reducer';
import { UserEffects } from './store/effects/user.effects';
import { BasketEffects } from './store/effects/basket.effects';
import { provideToastr } from 'ngx-toastr';
import { IconService } from './core/services/icon.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Import IconService
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { icons } from './icons-provider';
import { ru_RU, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';

registerLocaleData(ru);

const config = [
  provideNzIcons(icons),
  provideNzI18n(ru_RU),
  importProvidersFrom(FormsModule),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideHttpClient(withFetch()),
  provideStore({
    user: USER_REDUCER,
    basket: BASKET_REDUCER,
  }),
  provideAnimationsAsync(),
  provideEffects(UserEffects, BasketEffects),
  provideToastr(),
  {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [IconService],
    multi: true,
  },
  {
    provide: 'LOCALSTORAGE',
    useFactory: getLocalStorage,
  },
  provideNzIcons(icons),
  IconService, // Add IconService here
];

export const appConfig: ApplicationConfig = {
  providers: config,
};

export function getLocalStorage() {
  return typeof window !== 'undefined' ? window.localStorage : null;
}

export function initializeApp(iconService: IconService) {
  return () => iconService.registerIcons();
}
