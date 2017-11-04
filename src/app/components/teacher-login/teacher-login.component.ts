import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import Utils from '../../utils';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../services/authentication.service';

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
    if (Utils.isEmpty(this.name) || Utils.isEmpty(this.roomId) || Utils.isEmpty(this.password)) {
      return;
    }

    let body = {
      roomName: this.roomId,
      password: this.password,
      userName: this.name
    };

    this.http.post(`${environment.api}/rooms/connect/teacher`, body).subscribe(
      (data: any) => {
        if(data.success) {
          this.auth.authenticateTeacher(data.token);
        } else {
          this.serverMsg = data['message'];
        }
      },
      err => { }
    );
  }
}
