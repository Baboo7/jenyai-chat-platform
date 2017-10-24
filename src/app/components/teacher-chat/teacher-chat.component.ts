import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import { TokenManager } from '../../services/token-manager.service';
import { Parser } from '../../message-parser';
import { StudentInterface } from './student.interface';

@Component({
  selector: 'teacher-chat',
  templateUrl: './teacher-chat.component.html',
  styleUrls: [ './teacher-chat.component.scss' ],
  providers: [ WebsocketService, TokenManager ]
})
export class TeacherChatComponent implements OnInit, OnDestroy {

  private connection;
  private emitterType: string = 'teacher';
  private id: string;
  private isEmitterTyping: boolean = false;
  private messages = { };
  private selectedStudent: StudentInterface = { id: '', isTyping: false, name: '', userInput: '', unseen: 0 };
  private students: StudentInterface[ ] = [ ];

  @Output() private fireDisconnection: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private websocket: WebsocketService, private tokenManager: TokenManager) {
    this.websocket.connect();
  }

  ngOnInit() {
    this.connection = this.websocket.addListener('init').subscribe((data: any) => {
      this.id = data.id;
    });

    this.connection = this.websocket.addListener('disconnect').subscribe((data: any) => {
      this.disconnect();
    });

    this.connection = this.websocket.addListener('message').subscribe((data: any) => {
      this.addMessage(data);
    });

    this.connection = this.websocket.addListener('typing-on').subscribe((data: any) => {
      let emitter = data.emitter;
      let student = this.students.find(s => s.id === emitter);
      if (student) {
        student.isTyping = true;
        this.handleTypingIndicator(student);
      }
    });

    this.connection = this.websocket.addListener('typing-off').subscribe((data: any) => {
      let emitter = data.emitter;
      let student = this.students.find(s => s.id === emitter);
      if (student) {
        student.isTyping = false;
        this.handleTypingIndicator(student);
      }
    });

    this.connection = this.websocket.addListener('new-student').subscribe((data: any) => {
      let newStudent: StudentInterface = {
        id: data.student.id,
        isTyping: false,
        name: data.student.name,
        userInput: '',
        unseen: 0
      };
      this.students.push(newStudent);

      this.messages[newStudent.id] = [ ];
      data.messages.forEach(msg => {
        this.addMessage(msg);
      });
    });

    this.connection = this.websocket.addListener('del-student').subscribe((data: any) => {
      this.students = this.students.filter(student => student.id != data.student);
      if (this.selectedStudent.id === data.student) {
        this.selectedStudent = { id: '', isTyping: false, name: '', userInput: '', unseen: 0 };
      }
      delete this.messages[data.student];
    });

    let msg = {
      token: this.tokenManager.retrieveToken()
    };

    this.websocket.send('init', msg);
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
    this.websocket.disconnect();
  }

  addMessage(message): void {
    let msg = Parser.format(message, this.id);
    if (msg !== null) {
      let emitterId = msg.emitterType === 'student' ? msg.emitter : msg.recipient;
      this.messages[emitterId].push(msg);

      if (emitterId !== this.selectedStudent.id) {
        let student = this.students.find(s => s.id === emitterId);
        if (student) {
          student.unseen++;
        }
      }
    }
  }

  /*  Emit the event to disconnect the user from the room.

      PARAMS
        none

      RETURN
        none
  */
  private disconnect(): void {
    this.fireDisconnection.emit(true);
  }

  handleTypingIndicator(student: StudentInterface): void {
    student.isTyping && student.id === this.selectedStudent.id ? this.isEmitterTyping = true : this.isEmitterTyping = false;
  }

  onSelectedStudent(studentId: string): void {
    this.selectedStudent = this.students.find(s => s.id === studentId);
    if (this.selectedStudent) {
      this.selectedStudent.unseen = 0;
      this.handleTypingIndicator(this.selectedStudent);
    }
  }

  onUserInputChange(userInput: string): void {
    if (this.selectedStudent) {
      this.selectedStudent.userInput = userInput;
    }
  }
}
