import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CategoryResponse } from '../../../../../api/client';
import { environment } from '../../../../environments/environment.dev';
import { MenuService } from '../../../../services/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-item',
  imports: [CommonModule],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryItemComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() category: CategoryResponse;
  @Input() index: number;
  @Input() customInput: string = '';
  @Output() showSubsChange = new EventEmitter<boolean>();

  noImageUrl: string = environment.storageUrl + environment.noPhotoUrl;

  showLeft = false;
  showRight = false;

  categoryType = 6;

  pathImage: string;
  constructor(
    private router: Router,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    if (this.category.image) {
      this.pathImage = environment.productImageUrl + this.category.icon;
    } else {
      this.pathImage = this.noImageUrl;
    }

    this.menuService.categoryWidthStatus$
    .pipe( takeUntil(this.ngUnsubscribe) )
    .subscribe(data => {
      if (data) {
        this.categoryType = data;
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showSubs(): void {
    const hasChildren = this.category?.child?.length > 0;
    this.showSubsChange.emit(hasChildren);
  }

}
