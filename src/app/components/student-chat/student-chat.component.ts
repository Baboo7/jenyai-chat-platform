import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import { TokenManagerService } from '../../services/token-manager.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'student-chat',
  templateUrl: './student-chat.component.html',
  styleUrls: [ './student-chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class StudentChatComponent implements OnInit, OnDestroy {

  private id: string;
  private isEmitterTyping: boolean = false;
  private messages = [ ];
  private wordsPerMilliseconds: number = 260 / (60 * 1000);
  private MaxDelay: number = 5 * 1000;
  private defaultDelay: number = 1.5 * 1000;
  private delayBetweenMessages: number = 1.5 * 1000;

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

    this.websocket.addListener('message').subscribe((messages: any) => {
      if (messages[0].emitterType === 'agent') {
        this.simulateTyping(messages.reverse());
      } else {
        this.messages = this.messages.concat(messages);
      }
    });

    this.websocket.addListener('typing-on').subscribe((data: any) => {
      this.isEmitterTyping = true;
    });

    this.websocket.addListener('typing-off').subscribe((data: any) => {
      this.isEmitterTyping = false;
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

  /*  Disconnect the user from the room.

      PARAMS
        none

      RETURN
        none
  */
  private disconnect(): void {
    this.auth.disconnectStudent();
  }

  /*  Simulate typing of a message stack.

      PARAMS
        messages (array of objects): stack of messages to add

      RETURN
        none
  */
  private simulateTyping(messages): void {
    if (messages.length > 0) {
      this.isEmitterTyping = true;

      let delay;
      let message = messages[messages.length - 1].message;
      if (message.type === 'text') {
        let nbWords = message.text.split(' ').length;
        delay = nbWords / this.wordsPerMilliseconds;
      }
      else {
        delay = this.defaultDelay;
      }

      if (delay > this.MaxDelay) {
        delay = this.MaxDelay;
      }

      setTimeout(() => {
        this.isEmitterTyping = false;
        this.messages.push(messages.pop());
        setTimeout(() => {
          this.simulateTyping(messages);
        }, this.delayBetweenMessages);
      }, delay);
    }
  }
}
