import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FooterResponse,
  SocialNetworkResponse,
  StoreResponse,
} from '../../../../api/client';
import { FooterService } from './footer.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material';
import { forkJoin } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink, MaterialModule],
  providers: [FooterService],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  socials: SocialNetworkResponse[] | undefined;
  socialPath = '';
  footerInfo: FooterResponse | undefined;
  stores: StoreResponse[] | undefined;

  constructor(
    private footerApi: FooterService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFooterData();
  }

  loadFooterData() {
    forkJoin({
      stores: this.footerApi.getFooter(),
      socials: this.footerApi.getSocialNetworks(),
      footerInfo: this.footerApi.getFooterInfo(),
    })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: ({ stores, socials, footerInfo }) => {
          this.stores = stores as StoreResponse[];
          this.socials = socials as SocialNetworkResponse[];
          this.footerInfo = footerInfo as FooterResponse;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading footer data:', error);
        },
      });
  }

  getPhoneTitle(i: number, j: number) {
    if (this.footerInfo && this.footerInfo.stores && this.footerInfo.stores[i] && this.footerInfo.stores[i].phones) {
      return this.footerInfo.stores[i].phones.length - 1 === j
        ? this.footerInfo.stores[i].phones[j]
        : `${this.footerInfo.stores[i].phones[j]}, `;
    } else return null
  }

  goToMailContact(): void {
    // if (this.authService.isAuthenticated()) {
    //   this.navigateTo('/profile/mailing');
    // } else {
    //   this.menuService.modalContactStatusSource.next(true);
    // }
  }

  navigateTo(url: string): void {
    window.scroll(0, 0);
    this.router.navigate([url]);
  }

  tireNavigate(stringKey: string): void {
    this.router.navigate([stringKey]);
  }
}
