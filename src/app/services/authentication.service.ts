import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RoomService } from './room.service';
import { TokenManagerService } from './token-manager.service';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {

  constructor(
    private roomService: RoomService,
    private tokenManagerService: TokenManagerService,
    private router: Router
  ) { }

  /**************************/
  /*  interface
  /**************************/

  /*  Try to authenticate student.

      PARAMS
        roomInfo (object): information to connect to a room

      RETURN
        (Observable)
  */
  public authenticateStudent(roomInfo): Observable<any> {
    let observable = new Observable(observer => {
      this.roomService.connectStudent(roomInfo).subscribe((data: any) => {
        if(data.success) {
          this.tokenManagerService.storeToken(data.token);
          this.router.navigate([ '/student/chat' ]);
        } else {
          observer.next(data.message);
        }
      });
    });

    return observable;
  }

  /*  Disconnect student and redirect to login interface.

      PARAMS
        none

      RETURN
        none
  */
  public disconnectStudent(): void {
    this.tokenManagerService.removeToken();
    this.router.navigate([ '/student' ]);
  }

  /*  Try to authenticate teacher.

      PARAMS
        roomInfo (object): information to connect to a room

      RETURN
        (Observable)
  */
  public authenticateTeacher(roomInfo): Observable<any> {
    let observable = new Observable(observer => {
      this.roomService.connectTeacher(roomInfo).subscribe((data: any) => {
        if(data.success) {
          this.tokenManagerService.storeToken(data.token);
          this.router.navigate([ '/teacher/chat' ]);
        } else {
          observer.next(data.message);
        }
      });
    });

    return observable;
  }

  /*  Disconnect teacher and redirect to login interface.

      PARAMS
        none

      RETURN
        none
  */
  public disconnectTeacher(): void {
    this.tokenManagerService.removeToken();
    this.router.navigate([ '/teacher' ]);
  }
}
