import { Component } from '@angular/core';

import { TokenManager } from '../../services/token-manager.service';

@Component({
  selector: 'teacher-space',
  templateUrl: './teacher-space.component.html',
  styleUrls: [ './teacher-space.component.scss' ],
  providers: [ TokenManager ]
})
export class TeacherSpaceComponent {

  private connected: boolean = this.tokenManager.doesTokenExist();

  constructor(private tokenManager: TokenManager) { }

  /*  Disconnect the user from the room by removing the token.

      PARAMS
        none

      RETURN
        none
  */
  private disconnect(): void {
    this.tokenManager.removeToken();
    this.connected = false;
  }
}
