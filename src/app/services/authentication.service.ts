import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { TokenManager } from './token-manager.service';

@Injectable()
export class AuthenticationService {

  constructor(
    private tokenManager: TokenManager,
    private router: Router
  ) { }

  /**************************/
  /*  interface
  /**************************/

  /*  Authenticate student and redirect to chat interface.

      PARAMS
        token (string): token to store in local storage

      RETURN
        none
  */
  public authenticateStudent(token): void {
    this.tokenManager.storeToken(token);
    this.router.navigate([ '/student/chat' ]);
  }

  /*  Disconnect student and redirect to login interface.

      PARAMS
        none

      RETURN
        none
  */
  public disconnectStudent(): void {
    this.tokenManager.removeToken();
    this.router.navigate([ '/student' ]);
  }

  /*  Authenticate teacher and redirect to chat interface.

      PARAMS
        token (string): token to store in local storage

      RETURN
        none
  */
  public authenticateTeacher(token): void {
    this.tokenManager.storeToken(token);
    this.router.navigate([ '/teacher/chat' ]);
  }

  /*  Disconnect teacher and redirect to login interface.

      PARAMS
        none

      RETURN
        none
  */
  public disconnectTeacher(): void {
    this.tokenManager.removeToken();
    this.router.navigate([ '/teacher' ]);
  }
}
