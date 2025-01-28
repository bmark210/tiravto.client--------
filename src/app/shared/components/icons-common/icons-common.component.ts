import { CommonModule, NgSwitch } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-icons-common',
  imports: [CommonModule],
  templateUrl: './icons-common.component.html',
  styleUrl: './icons-common.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconsCommonComponent {
  @Input() text: string;
  @Input() type: string;
  @Input() wishState: boolean;

  constructor() { }
}
