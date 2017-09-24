import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Utils from '../../utils';

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

  constructor(private http: HttpClient) { }

  joinSession(): void {
    if (Utils.isEmpty(this.name) || Utils.isEmpty(this.roomId)) {
      return;
    }

    this.http.get(`http://localhost:8080/classroom/${this.roomId}`).subscribe(
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
