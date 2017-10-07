import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Utils from '../../utils';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'teacher-login',
  templateUrl: './teacher-login.component.html',
  styleUrls: ['./teacher-login.component.scss']
})
export class TeacherLoginComponent {

  @Input() private name: string;
  @Input() private roomId: string;
  @Input() private password: string;
  @Input() private connected: boolean;
  @Output() private nameChange: EventEmitter<string> = new EventEmitter();
  @Output() private roomIdChange: EventEmitter<string> = new EventEmitter();
  @Output() private connectedChange: EventEmitter<boolean> = new EventEmitter();

  private namePatrn = /^([A-Z]([A-Z]|[a-z])*\s?)+$/;
  private uppercasePatrn = /^[A-Z]+$/;

  constructor(private http: HttpClient) { }

  joinSession(): void {
    if (Utils.isEmpty(this.name) || Utils.isEmpty(this.roomId) || Utils.isEmpty(this.password)) {
      return;
    }

    this.http.post(`${environment.api.classroom}${this.roomId}`, { password: this.password }).subscribe(
      data => {
        if(data['success']) {
          this.nameChange.emit(this.name);
          this.roomIdChange.emit(this.roomId);
          this.connectedChange.emit(true);
        }
      },
      err => { }
    );
  }
}
