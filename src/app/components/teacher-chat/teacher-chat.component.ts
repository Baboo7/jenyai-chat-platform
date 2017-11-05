import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import { TokenManagerService } from '../../services/token-manager.service';
import { AuthenticationService } from '../../services/authentication.service';
import { StudentInterface } from './student.interface';

@Component({
  selector: 'teacher-chat',
  templateUrl: './teacher-chat.component.html',
  styleUrls: [ './teacher-chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class TeacherChatComponent implements OnInit, OnDestroy {

  private emitterType: string = 'teacher';
  private id: string;
  private isEmitterTyping: boolean = false;
  private messages = { };
  private selectedStudent: StudentInterface = { id: '', isTyping: false, name: '', userInput: '', unseen: 0 };
  private students: StudentInterface[ ] = [ ];

  private cssHeight: number;
  private debounceTime: number = 50;
  private resizeTimeout: number;

  constructor(
    private websocket: WebsocketService,
    private tokenManager: TokenManagerService,
    private auth: AuthenticationService
  ) {
    this.websocket.connect();
  }

  ngOnInit() {
    this.websocket.addListener('init').subscribe((data: any) => {
      this.id = data.id;
    });

    this.websocket.addListener('message').subscribe((data: any) => {
      data.forEach(msg => {
        this.addMessage(msg);
      });
    });

    this.websocket.addListener('typing-on').subscribe((data: any) => {
      let emitter = data.emitter;
      let student = this.students.find(s => s.id === emitter);
      if (student) {
        student.isTyping = true;
        this.handleTypingIndicator(student);
      }
    });

    this.websocket.addListener('typing-off').subscribe((data: any) => {
      let emitter = data.emitter;
      let student = this.students.find(s => s.id === emitter);
      if (student) {
        student.isTyping = false;
        this.handleTypingIndicator(student);
      }
    });

    this.websocket.addListener('new-student').subscribe((data: any) => {
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

    this.websocket.addListener('del-student').subscribe((data: any) => {
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
    this.websocket.disconnect();
  }

  /*  Resize the size of the main container on window resize.

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

  addMessage(message): void {
    let emitterId = message.emitterType === 'student' ? message.emitter : message.recipient;
    this.messages[emitterId].push(message);

    if (emitterId !== this.selectedStudent.id) {
      let student = this.students.find(s => s.id === emitterId);
      if (student) {
        student.unseen++;
      }
    }
  }

  /*  Disconnect the user from the room.

      PARAMS
        none

      RETURN
        none
  */
  private disconnect(): void {
    this.auth.disconnectTeacher();
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
