import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CategoryResponse } from '../../../../api/client';
import { MenuService } from '../../../services/menu.service';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {data} from '../header-category-btn/data';

@Component({
  selector: 'app-category-button',
  imports: [MatButton, CommonModule],
  templateUrl: './category-button.component.html',
  styleUrl: './category-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryButtonComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() categories: CategoryResponse[];


  tecDocActive = false;

    constructor(
      private menuService: MenuService,
      private router: Router,
      // private location: Location,
    ) { }

    ngOnInit() {
      this.menuService.settingBoolStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => { this.tecDocActive = state ? state.tecDoc : true; });
    }

    ngOnDestroy(): void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }

    toCategory(): void {
      this.menuService.categoryBtnSource.next(true);
      this.router.navigate([`/catalog`], { queryParams: null });
    }

}
