import { Component, Input } from '@angular/core';

@Component({
  selector: 'video-message',
  templateUrl: './video.component.html',
  styleUrls: [ './video.component.scss' ]
})
export class VideoComponent {
  @Input() align: string;
  @Input() url: string;
}
