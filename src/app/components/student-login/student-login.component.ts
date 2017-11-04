import { Component, HostListener, OnInit } from '@angular/core';

import Utils from '../../utils';

import { AuthenticationService } from '../../services/authentication.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {

  private name: string;
  private roomId: string;
  private roomsName: Array<string> = [ ];
  private serverMsg: string = ''; // Message received from the server
  private roomIdPatrn = /^([A-Z]|[a-z]|[0-9]|-|_|\s)+$/; // Regex for uppercase validation

  private cssHeight: number;
  private debounceTime: number = 50;
  private resizeTimeout: number;

  constructor(
    private authService: AuthenticationService,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.roomService.getAllRoomsName().subscribe((roomsName: Array<string>) => {
      this.roomsName = roomsName;
    });
  }

  /*  Resize the size of the background on window resize.

      PARAMS
        event (event object): event fired on window resize

      RETURN
        none
  */
  @HostListener('window:resize', [ '$event' ])
  private onWindowResize(event): void {
    // debounce resize, wait for resize to finish before doing stuff
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout((() => {
      this.cssHeight = event.target.innerHeight;
    }).bind(this), this.debounceTime);
  }

  joinSession(): void {
    if (Utils.isEmpty(this.name) || Utils.isEmpty(this.roomId)) {
      return;
    }

    let roomInfo = {
      roomName: this.roomId,
      userName: this.name
    };

    this.authService.authenticateStudent(roomInfo).subscribe((serverMsg) => {
      this.serverMsg = serverMsg;
    });
  }
}
