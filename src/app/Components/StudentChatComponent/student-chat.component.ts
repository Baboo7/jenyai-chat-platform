import { Component } from '@angular/core';

import { WebsocketService } from '../../Services/websocket.service';

@Component({
  selector: 'student-chat',
  templateUrl: './student-chat.component.html',
  styleUrls: [ './student-chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class StudentChatComponent {

  constructor(private websocket: WebsocketService) {
    this.websocket.send('get-uuid', {});
  }
}
