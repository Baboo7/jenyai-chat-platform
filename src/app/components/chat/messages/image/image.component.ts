import { Component, Input } from '@angular/core';

@Component({
  selector: 'image-message',
  templateUrl: './image.component.html',
  styleUrls: [ './image.component.scss' ]
})
export class ImageComponent {

	private magnified: boolean = false;

  @Input() align: string;
  @Input() src: string;



	/******************************************
  /*
  /*      TEMPLATE EVENTS
  /*
  /*****************************************/



  /*  Toggle the magnify view of an image.

      PARAMS
        none

      RETURN
        none
  */
  private onImageClicked(): void {

		this.magnified = !this.magnified;
	}
}
