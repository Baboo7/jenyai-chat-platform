import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-message',
  templateUrl: './text.component.html',
  styleUrls: [ './text.component.scss' ]
})
export class TextComponent {
  @Input() align: string;
  @Input() text: string;
}
