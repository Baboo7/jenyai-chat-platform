import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-message',
  templateUrl: './text-message.component.html',
  styleUrls: [ 'text-message.component.scss' ]
})
export class TextMessageComponent {
  @Input() private text: string;
  @Input() private align: string;
}
