import { Pipe } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe {

    constructor(private _sanitizer: DomSanitizer){}

  transform(html: string) : SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

}
