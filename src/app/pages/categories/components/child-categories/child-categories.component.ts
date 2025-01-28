import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryResponse } from '../../../../../api/client';
import { NgFor, NgIf } from '@angular/common';
import { CategoryItemComponent } from '../category-item/category-item.component';

@Component({
  selector: 'app-child-categories',
  imports: [NgIf, NgFor, CategoryItemComponent],
  templateUrl: './child-categories.component.html',
  styleUrl: './child-categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildCategoriesComponent {
  @Input() currentCategory: CategoryResponse;
  @Input() showSubCategory: boolean;
  @Output() showSubChange = new EventEmitter<boolean>();
  @Output() showAllMainChange = new EventEmitter<boolean>();
  @Output() showChildProductChange = new EventEmitter<string>();

  childs: CategoryResponse[];
  constructor() { }

  ngOnInit() {
    this.childs = this.currentCategory.child;
  }

  // Показать все товары в родителе
  showAll(): void {
    this.showSubChange.emit(this.showSubCategory);
  }

  // Показать все каталоги
  showAllMain(): void {
    this.showAllMainChange.emit(true);
  }

  // Товара дочерней категроии
  showChildProducts(index: number): void {    ;
    this.showChildProductChange.emit(this.childs[index].stringKey);
  }

}
