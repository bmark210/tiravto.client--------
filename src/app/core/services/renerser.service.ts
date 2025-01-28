import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomRendererService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addClass(element: HTMLElement, className: string): void {
    if (element) {
      this.renderer.addClass(element, className);
    }
  }

  removeClass(element: HTMLElement, className: string): void {
    if (element) {
      this.renderer.removeClass(element, className);
    }
  }
}
