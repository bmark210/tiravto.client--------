import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    console.log('Icon service initialized');
  }

  registerIcons(): Promise<void> {
    return new Promise((resolve) => {
      const icons = [
        'heart',
        'heart-filled',
        'basket',
        'box',
        'count-zero',
        'count',
        'delivery',
        'heart-big',
      ];

      icons.forEach((icon) => {
        this.iconRegistry.addSvgIcon(
          icon,
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `assets/icons/${icon}.svg`
          )
        );
      });

      resolve();
    });
  }
}
