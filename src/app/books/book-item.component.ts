import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from './book';

@Component({
  selector: 'app-book-item',
  imports: [RouterLink],
  templateUrl: './book-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookItemComponent {
  readonly book = input.required<Book>();
}
