import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Utils from '../../utils';
import { environment } from '../../../environments/environment';
import { TokenManager } from '../../services/token-manager.service';

@Component({
  selector: 'teacher-login',
  templateUrl: './teacher-login.component.html',
  styleUrls: ['./teacher-login.component.scss'],
  providers: [ TokenManager ]
})
export class TeacherLoginComponent {

  private name: string;
  private roomId: string;
  private password: string;
  private serverMsg: string = ''; // Message received from the server
  private namePatrn = /^([A-Z]([A-Z]|[a-z])*\s?)+$/; // Regex for name validation
  private roomIdPatrn = /^([A-Z]|[a-z]|[0-9]|-|_)+$/; // Regex for uppercase validation

  @Input() private connected: boolean;

  @Output() private connectedChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private tokenManager: TokenManager) { }

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
          this.tokenManager.storeToken(data.token);
          this.connectedChange.emit(true);
        } else {
          this.serverMsg = data['message'];
        }
      },
      err => { }
    );
  }
}
