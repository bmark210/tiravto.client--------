import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserSearch } from '../../../core/models/user-search';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  ProductSuggestResponse,
  CategorySuggestResponse,
} from '../../../../api/client';
import { MenuService } from '../../../services/menu.service';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule, ReactiveFormsModule],
  providers: [MenuService],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  @Input() searchActual: string;
  filteredProducts: ProductSuggestResponse[];
  filteredCategories: CategorySuggestResponse[];
  usersForm: FormGroup;
  isLoading = false;
  private unsubscribe: Subject<void> = new Subject();
  // searchBy = 'Поиск по всем каталогам';
  // searchType = 0;
  // searchTypeMobile = 0;
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private router: Router,
    private _headerComponent: HeaderComponent
  ) {}

  ngOnInit() {
    if (this.searchActual) {
      this.usersForm = this.fb.group({
        userInput: [
          this.searchActual,
          [Validators.required, Validators.maxLength(3)],
        ],
      });
    }
    if (!this.searchActual) {
      this.usersForm = this.fb.group({
        userInput: [null, [Validators.required, Validators.maxLength(3)]],
      });
    }

    this._headerComponent.updateSearch.subscribe((search) => {
      this.usersForm.controls['userInput'].setValue(search);
    });
    // const subsciptionInput = this.usersForm
    //   .get('userInput')
    //   .valueChanges
    //   .pipe(
    //     filter((value: string) => (value ? value.length > 2 : false)),
    //     tap(() => this.isLoading = true),
    //     debounceTime(1000),

    //     switchMap(value => {
    //       return this._searchService.search(value, 1)
    //         .catch(err => {
    //           return Observable.of(err);
    //         })
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false;
    //           }),
    //         );
    //     }
    //     ),
    //     tap(() => (this.isLoading = false)),
    //   ).pipe(takeUntil(this.unsubscribe))
    //   .subscribe(prods => {
    //     this.filteredProducts = prods.productSuggests;
    //     this.filteredCategories = prods.categoriesSuggests;
    //   },
    //     (err) => {
    //     },
    //     () => {
    //     }
    //   );
  }

  priceOnlineSearch(): void {
    if (this.usersForm.value.userInput) {
      window.scroll(0, 0);
      this.filteredProducts = null;
      this.filteredCategories = null; //        url_ = url_.replace(/[?&]$/, "");
      let inputValue = this.usersForm.value.userInput;
      inputValue = inputValue.replace(/[?&]$/, '');
      const newstr = inputValue.replace('/', '');
      // this.router.navigate([`/price-online/?code=${newstr}`]);
      this.menuService.priceOnlineSearchSource.next(newstr);
      this.router.navigate([`/price-online/`], {
        queryParams: { code: `${newstr}` },
      });
    }
  }

  // searchChanged(type: any): void {
  //   switch (type) {
  //     case '1':
  //       this.searchBy = 'Поиск по TEC DOC';
  //       this.searchType = type;
  //       break;
  //     case '2':
  //       this.searchBy = 'Поиск по сайту';
  //       this.searchType = type;
  //       break;
  //     default:
  //       this.searchBy = 'Поиск по всем каталогам';
  //       this.searchType = 0;
  //       break;
  //   }
  //   this.searchTypeMobile = type;
  // }

  displayFn(user: UserSearch): string | null {
    if (user) {
      return user.title;
    } else return null;
  }

  navigateTo(stringKey: string): void {
    //     window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // });
    window.scroll(0, 0);
    this.router.navigate([`/products/`], {
      queryParams: {
        category: stringKey,
        page: 1,
        take: 20,
        minprice: 0,
        maxprice: 0,
        orderby: 0,
      },
    });
  }

  Search(query: string): void {
    if (this.usersForm) {
      this.filteredProducts = null;
      this.filteredCategories = null;
      window.scroll(0, 0);
      this.menuService.priceOnlineSearchSource.next(query);
      this.router.navigate([`/price-online/`], {
        queryParams: { code: `${query}` },
      });
    }
  }

  onEnter(evt: any) {
    if (evt.source.selected) {
      this.Search(evt.source.value);
    }
  }
}
