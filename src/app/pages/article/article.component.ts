import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-article',
  imports: [],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent {

}
