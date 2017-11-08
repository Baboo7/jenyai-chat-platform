import { Component, Input } from '@angular/core';

@Component({
  selector: 'image-message',
  templateUrl: './image.component.html',
  styleUrls: [ './image.component.scss' ]
})
export class ImageComponent {
  @Input() align: string;
  @Input() src: string;
}
