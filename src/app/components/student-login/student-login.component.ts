import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Utils from '../../utils';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent {

  @Input() private name: string;
  @Input() private roomId: string;
  @Input() private connected: boolean;
  @Output() private nameChange: EventEmitter<string> = new EventEmitter();
  @Output() private roomIdChange: EventEmitter<string> = new EventEmitter();
  @Output() private connectedChange: EventEmitter<boolean> = new EventEmitter();

  private serverMsg: string = ''; // Message received from the server
  private namePatrn = /^([A-Z]([A-Z]|[a-z])*\s?)+$/; // Regex for name validation
  private uppercasePatrn = /^[A-Z]+$/; // Regex for uppercase validation

  constructor(private http: HttpClient) { }

  joinSession(): void {
    this.serverMsg = '';

    if (Utils.isEmpty(this.name) || Utils.isEmpty(this.roomId)) {
      return;
    }

    let body = {
      id: this.roomId
    };

    this.http.post(`${environment.api}/rooms/connect/student`, body).subscribe(
      data => {
        if(data['success']) {
          this.nameChange.emit(this.name);
          this.roomIdChange.emit(this.roomId);
          this.connectedChange.emit(true);
        } else {
          this.serverMsg = data['message'];
        }
      },
      err => { }
    );
  }
}
