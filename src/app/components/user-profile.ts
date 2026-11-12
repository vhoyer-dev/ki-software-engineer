import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<p>user-profile works!</p>`,
  styles: ``
})
export class UserProfile {}
