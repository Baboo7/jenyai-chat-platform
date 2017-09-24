import { Component, EventEmitter, Input } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import Utils from '../../utils';

@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html',
  styleUrls: [ 'chat.component.scss' ]
})
export class ChatComponent {

  private userInput = '';
  @Input() private emitterType;
  @Input() private recipient;
  @Input() private messages;

  constructor(private websocket: WebsocketService) { }

  private sendMessage(): void {
    if (Utils.isEmpty(this.userInput)) {
      return;
    }

    this.websocket.send('message', {
      recipient: this.recipient,
      type: 'text',
      payload: this.userInput
    });
    this.userInput = '';
  }

  private handleKeyDown(event): void {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }
}
