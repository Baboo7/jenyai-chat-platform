import { Component } from '@angular/core';

import { WebsocketService } from '../../Services/websocket.service';

@Component({
  selector: 'teacher-chat',
  templateUrl: './teacher-chat.component.html',
  styleUrls: [ './teacher-chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class TeacherChatComponent {

  private emitterType = 'teacher';

  constructor(private websocket: WebsocketService) {
    this.websocket.send('init', {emitterType: this.emitterType});
  }
}
