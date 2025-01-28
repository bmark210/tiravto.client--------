import { NgModule } from '@angular/core';
import { MaterialModule } from './material';
import { CommonModule } from '@angular/common';
import { CustomMatMenuComponent } from '../../pages/home/components/custom-mat-menu/custom-mat-menu.component';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CdkModule } from './cdk-module';

@NgModule({
  // imports: [MaterialModule, CommonModule, CdkOverlayOrigin, CdkModule],
  // declarations: [CustomMatMenuComponent],
  // exports: [
  //   CustomMatMenuComponent
  // ],
})
export class MenuModule {}
