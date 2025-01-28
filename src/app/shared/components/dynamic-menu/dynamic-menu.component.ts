import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MenuResponse } from '../../../../api/client';
import { MenuService } from '../../../services/menu.service';
import { MaterialModule } from '../../modules/material';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-menu',
  imports: [MaterialModule, CommonModule],
  templateUrl: './dynamic-menu.component.html',
  styleUrl: './dynamic-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicMenuComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() header: MenuResponse[];

  menuIntensifies = 0;

  constructor(
    private router: Router,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    this.menuService.menuIntensifies = this.menuIntensifies;
    this.menuService.menuIntensifiesStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          this.menuIntensifies = data;
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  menuNavigate(menuIndex: any, subMenuIndex: any): void {
    let url = '';
    if (subMenuIndex > -1) {
      // tslint:disable-next-line:max-line-length
      url = this.header[menuIndex].items[subMenuIndex].page ? `/pages${this.header[menuIndex].items[subMenuIndex].page.url}` : this.header[menuIndex].items[subMenuIndex].url;
    } else {
      url = this.header[menuIndex].page ? `/pages${this.header[menuIndex].page.url}` : this.header[menuIndex].url;
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.router.navigate([url]);
  }
}
