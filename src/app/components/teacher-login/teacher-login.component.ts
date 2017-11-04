import { Component, OnInit } from '@angular/core';

import Utils from '../../utils';

import { AuthenticationService } from '../../services/authentication.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'teacher-login',
  templateUrl: './teacher-login.component.html',
  styleUrls: ['./teacher-login.component.scss']
})
export class TeacherLoginComponent implements OnInit {

  private name: string;
  private roomId: string;
  private roomsName: Array<string> = [ ];
  private password: string;
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
    if (Utils.isEmpty(this.name) || Utils.isEmpty(this.roomId) || Utils.isEmpty(this.password)) {
      return;
    }

    let roomInfo = {
      roomName: this.roomId,
      password: this.password,
      userName: this.name
    };

    this.authService.authenticateTeacher(roomInfo).subscribe((serverMsg) => {
      this.serverMsg = serverMsg;
    });
  }
}
