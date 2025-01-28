import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LayoutModule } from '@angular/cdk/layout';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  imports: [
    DragDropModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    LayoutModule,
    ClipboardModule,
  ],
  exports: [
    DragDropModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    LayoutModule,
    ClipboardModule,
  ],
})
export class CdkModule {}
