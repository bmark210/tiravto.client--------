import { ChangeDetectionStrategy, Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ModulesList } from './menu';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { BehaviorSubject, fromEvent, merge, Subscription } from 'rxjs';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-custom-mat-menu',
  standalone: true,
  imports: [CommonModule, NzMenuModule, NzIconModule],
  templateUrl: './custom-mat-menu.component.html',
  styleUrls: ['./custom-mat-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMatMenuComponent {
  menuItems = [
    {
      title: 'Главное меню',
      children: [
        { title: 'Элемент 1' },
        { title: 'Элемент 2' },
        {
          title: 'Подменю',
          children: [
            { title: 'Подэлемент 1' },
            { title: 'Подэлемент 2' },
          ],
        },
      ],
    },
    { title: 'Отдельный пункт' },
  ];



  modulesList: Array<any> = ModulesList;

  isTouchDevice = false;
  isMatMenuOpen$ = new BehaviorSubject<boolean>(false);
  isMatMenu2Open$ = new BehaviorSubject<boolean>(false);

  private subscriptions = new Subscription();

  constructor(private renderer: Renderer2) {
    this.detectTouchDevice();
  }

  private detectTouchDevice(): void {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  @ViewChild('menuContainer', { read: ElementRef })
  menuContainer!: ElementRef;

  @ViewChild('levelOneTrigger', { static: true, read: MatMenuTrigger })
  levelOneTrigger!: MatMenuTrigger;

  @ViewChild('levelTwoTrigger', { static: true, read: MatMenuTrigger })
  levelTwoTrigger!: MatMenuTrigger;

  ngAfterViewInit(): void {
    if (this.menuContainer) {
      const mouseEnter$ = fromEvent(this.menuContainer.nativeElement, 'mouseenter');
      const mouseLeave$ = fromEvent(this.menuContainer.nativeElement, 'mouseleave');

      const hoverSubscription = merge(mouseEnter$, mouseLeave$).subscribe((event: Event) => {
        const isHovered = event.type === 'mouseenter';
        if (isHovered) {
          this.openMenu(this.levelOneTrigger);
        } else {
          this.closeMenu(this.levelOneTrigger);
        }
      });

      this.subscriptions.add(hoverSubscription);
    }
  }

  openMenu(trigger: MatMenuTrigger): void {
    if (!trigger.menuOpen) {
      trigger.openMenu();
    }
  }

  closeMenu(trigger: MatMenuTrigger): void {
    if (trigger.menuOpen) {
      trigger.closeMenu();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }
}
