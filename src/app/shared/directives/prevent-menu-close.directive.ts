import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[preventMenuClose]',
})
export class PreventMenuCloseDirective {
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.stopPropagation();
  }
}
