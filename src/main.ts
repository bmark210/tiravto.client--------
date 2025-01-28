import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
        // "ngx-mat-menu-hover": "^1.0.3",
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
