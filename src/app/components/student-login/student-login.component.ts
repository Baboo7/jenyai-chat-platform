import { Component, OnInit } from '@angular/core';

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

  constructor(
    private authService: AuthenticationService,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.roomService.getAllRoomsName().subscribe((roomsName: Array<string>) => {
      this.roomsName = roomsName;
    });
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
