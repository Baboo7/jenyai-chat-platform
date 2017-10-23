import { Component, Output, EventEmitter } from '@angular/core';

@Component ({
  selector: 'chat-header',
  templateUrl: 'chat-header.component.html',
  styleUrls: ['chat-header.component.scss']
})
export class ChatHeaderComponent {

  @Output() fireDisconnection: EventEmitter<boolean> = new EventEmitter();

  /*  Triggers an event to disconnect the user from the room.

      PARAMS
        none

      RETURN
        none
  */
  private disconnect(): void {
    this.fireDisconnection.emit(true);
  }
}
