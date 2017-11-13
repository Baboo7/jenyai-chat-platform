import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import { TokenManagerService } from '../../services/token-manager.service';
import { AuthenticationService } from '../../services/authentication.service';
import { StudentInterface, initStudentInterface } from './student.interface';

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
  private selectedStudent: StudentInterface = initStudentInterface();
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

    this.websocket.addListener('init').subscribe((data: any) => this.onInit(data));

    this.websocket.addListener('message').subscribe((data: any) => this.onMessage(data));

    this.websocket.addListener('typing-on').subscribe((data: any) => this.onTyping(data, true));

    this.websocket.addListener('typing-off').subscribe((data: any) => this.onTyping(data, false));

    this.websocket.addListener('student-connected').subscribe((data: any) => this.onStudentConnected(data));

    this.websocket.addListener('student-updated').subscribe((data: any) => this.onStudentUpdated(data));

    this.websocket.addListener('student-disconnected').subscribe((data: any) => this.onStudentDisconnected(data));

    let msg = {
      token: this.tokenManager.retrieveToken()
    };

    this.websocket.send('init', msg);
  }

  ngOnDestroy() {
    this.websocket.disconnect();
  }



  /******************************************
  /*
  /*      WEBSOCKET EVENTS
  /*
  /*****************************************/



  /*  Handle init event.

      PARAMS
        data (object): must contain
          id (string): id of the current user

      RETURN
        none
  */
  private onInit(data: any): void {

    this.id = data.id;
  }

  /*  Handle message event.

      PARAMS
        messages (array of objects)

      RETURN
        none
  */
  private onMessage(messages: any[ ]): void {

    if (!messages) return;

    messages.forEach(msg => {
      this.addMessage(msg);
    });
  }

  /*  Handle typing event.

      PARAMS
        data (object): must contain
          emitter (string): id of the emitter
        state (boolean): state of the typing indicator

      RETURN
        none
  */
  private onTyping(data: any, state: boolean): void {

    let emitter = data.emitter;
    let student = this.students.find(s => s.id === emitter);
    if (student) {
      student.isTyping = state;
      this.handleTypingIndicator(student);
    }
  }

  /*  Create a student.

      PARAMS
        data (object): holds the new student information. Must contain
          student (object): cf StudentInterface
            id (string)
            name (string)
            discussWithAgent (boolean)
          messages (array of objects)

      RETURN
        none
  */
  private onStudentConnected(data: any): void {

    let newStudent: StudentInterface = {
      id: data.student.id,
      isTyping: false,
      name: data.student.name,
      discussWithAgent: data.student.discussWithAgent,
      userInput: '',
      unseen: 0
    };

    this.students.push(newStudent);

    this.messages[newStudent.id] = [ ];
    data.messages.forEach(msg => {
      this.addMessage(msg);
    });
  }

  /*  Update a student.

      PARAMS
        data (object): holds the new student information. Must contain (cf StudentInterface)
          id (string)
          name (string)
          discussWithAgent (boolean)

      RETURN
        none
  */
  private onStudentUpdated(data: any): void {

    let student = this.students.find(s => s.id === data.id);
    if (student) {
      student.id = data.id;
      student.name = data.name;
      student.discussWithAgent = data.discussWithAgent;
    }
  }

  /*  Delete a student.

      PARAMS
        data (object): holds the student information. Must contain (cf StudentInterface)
          id (string)

      RETURN
        none
  */
  private onStudentDisconnected(data: any): void {

    this.students = this.students.filter(s => s.id != data.student);
    if (this.selectedStudent.id === data.student) this.selectedStudent = initStudentInterface();
    delete this.messages[data.student];
  }



  /******************************************
  /*
  /*      TEMPLATE EVENTS
  /*
  /*****************************************/



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

  /*  Select a student.

      PARAMS
        id (string): id of the student

      RETURN
        none
  */
  onSelectedStudent(id: string): void {

    this.selectedStudent = this.students.find(s => s.id === id);
    if (this.selectedStudent) {
      this.selectedStudent.unseen = 0;
      this.handleTypingIndicator(this.selectedStudent);
    }
  }

  /*  Update user input for a student.

      PARAMS
        userInput (string): input to save

      RETURN
        none
  */
  onUserInputChange(userInput: string): void {

    if (this.selectedStudent) {
      this.selectedStudent.userInput = userInput;
    }
  }



  /******************************************
  /*
  /*      CORE
  /*
  /*****************************************/



  /*  Add a message in a student messages stack.

      PARAMS
        message (object)

      RETURN
        none
  */
  private addMessage(message): void {

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

  /*  handle the display of the typing indicator.

      PARAMS
        student (StudentInterface)

      RETURN
        none
  */
  private handleTypingIndicator(student: StudentInterface): void {

    student.isTyping && student.id === this.selectedStudent.id ? this.isEmitterTyping = true : this.isEmitterTyping = false;
  }
}
