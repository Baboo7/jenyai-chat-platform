import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WebsocketService } from '../../Services/websocket.service';

@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html',
  styleUrls: [ 'chat.component.scss' ]
})
export class ChatComponent {

  private userInput = '';
  @Input() private recipient;
  @Input() private messages;
  @Output() messagesChange: EventEmitter<object[]> = new EventEmitter();

  constructor(private websocket: WebsocketService) { }

  private sendMessage(): void {
    this.websocket.send('message', {
      recipient: this.recipient,
      type: 'text',
      payload: this.userInput
    });
    if (this.messages === undefined) {
      this.messages = [];
    }
    this.messages.push({message: {payload: this.userInput}});
    this.messagesChange.emit(this.messages);
    this.userInput = '';
  }

  private handleKeyDown(event): void {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }
}
