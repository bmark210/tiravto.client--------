import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PaginatorResponse } from '../../../../api/client';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() paginator: PaginatorResponse;
  @Output() changePaginator = new EventEmitter<PaginatorResponse>();

  type = 0;

  countPages = Array;

  constructor(
    private menuService: MenuService
  ) { }

  ngOnInit() {
    this.initType();
    this.menuService.paginatorStatus$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(data => {
      if (data) {
        this.paginator = data as PaginatorResponse;
        this.initType();
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges() {
    this.initType();
  }

  changePage(page: number): void {
    if (page < 1) {
      page = 1;
    }
    if (page > this.paginator.pageCount) {
      page = this.paginator.pageCount;
    }
    this.paginator.page = page;
    this.initType();
    this.changePaginator.emit(this.paginator);
    window.scroll(0, 0);
  }

  initType(): void {
    const page = this.paginator.page;
    const total = this.paginator.pageCount;
    if (total === 1) {
      this.type = 6;
    }
    if (total <= 5) {
      this.type = 0;
      return;
    }
    if (page >= 1 && page < 3) {
      this.type = 1;
      return;
    }
    if (page >= 3 && page <= 5) {
      this.type = 2;
      return;
    }
    if (page - 4 > 1 && page + 4 < total) {
      this.type = 3;
      return;
    }
    if (page >= total - 4 && page <= total - 3) {
      this.type = 4;
      return;
    }
    if (page + 3 > total) {
      this.type = 5;
      return;
    }
  }
}
