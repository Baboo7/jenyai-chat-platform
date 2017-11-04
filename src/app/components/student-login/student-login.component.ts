import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import Utils from '../../utils';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../services/authentication.service';

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
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.http.get(`${environment.api}/rooms`).subscribe(
      (data: any) => {
        if(data.success) {
          this.roomsName = data.rooms;
        }
      }
    );
  }

  joinSession(): void {
    this.serverMsg = '';

    if (Utils.isEmpty(this.name) || Utils.isEmpty(this.roomId)) {
      return;
    }

    let body = {
      roomName: this.roomId,
      userName: this.name
    };

    this.http.post(`${environment.api}/rooms/connect/student`, body).subscribe(
      (data: any) => {
        if(data.success) {
          this.auth.authenticateStudent(data.token);
        } else {
          this.serverMsg = data['message'];
        }
      }
    );
  }
}
