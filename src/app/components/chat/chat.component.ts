import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewChecked, DoCheck, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import Utils from '../../utils';

@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html',
  styleUrls: [ 'chat.component.scss' ],
  providers: [ SpeechRecognitionService ]
})
export class ChatComponent implements AfterViewChecked, DoCheck, OnDestroy {

  private recording: boolean = false;
  private recordSession;
  private totalMsgs: number = 0;
  private toScroll: boolean;
  private wasTyping: boolean = false;

  @Input() private isEmitterTyping: boolean = false;
  private wasEmitterTyping: boolean = false;

  @Input() private messages;
  @Input() private userInput = '';
  // Indicate how the message has been entered: either 'typed' or 'speech'
  private media: string = 'typed';

  @Output() userInputChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('convTainer') private convTainer: ElementRef;

  constructor(
    private websocket: WebsocketService,
    private speechRecognitionService: SpeechRecognitionService
  ) { }

  ngAfterViewChecked() {
    if (this.toScroll) {
      try {
        this.convTainer.nativeElement.scrollTop = this.convTainer.nativeElement.scrollHeight;
      } catch(err) { }
      this.toScroll = false;
    }
  }

  ngDoCheck() {
    let newTotalMsgs = 0;
    if (this.messages) { newTotalMsgs = this.messages.length; }
    if (this.totalMsgs !== newTotalMsgs) {
      this.toScroll = true;
      this.totalMsgs = newTotalMsgs;
    }

    if (!this.wasEmitterTyping && this.isEmitterTyping) {
      this.toScroll = true;
      this.wasEmitterTyping = true;
    } else if (this.wasEmitterTyping && !this.isEmitterTyping) {
      this.wasEmitterTyping = false;
    }
  }

  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }

  /*  Toggle speech recognition.

      PARAMS
        none

      RETURN
        none
  */
  private toggleSpeechRecognition(): void {

    this.recording = !this.recording;

    if (this.recording) {
      this.media = 'speech';

      this.recordSession = this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          this.userInput = value;
        },
        //errror
        (err) => {
          this.recording = false;
        },
        //completion
        () => {
          this.recording = false;
        }
      );
    } else {
      this.media = 'typed';

      this.recordSession.unsubscribe();
    }
  }

  /*  Send a message to the server.

      PARAMS
        none

      RETURN
        none
  */
  private onSendMessage(): void {

    if (Utils.isEmpty(this.userInput)) {
      return;
    }

    let msg = {
      type: 'text',
      payload: {
        text: this.userInput,
        media: this.media
      }
    };

    this.websocket.send('message', msg);
    this.userInput = '';
    this.media = 'typed';
  }

  /*  Handle key down event.

      PARAMS
        event (event object)

      RETURN
        none
  */
  private onKeyDown(event): void {

    if (event.keyCode === 13) {
      this.onSendMessage();
    }

    this.handleTypingState();
  }

  /*  Handle input event.

      PARAMS
        event (event object)

      RETURN
        none
  */
  private onInput(event): void {

    this.userInput = event.target.value;
    this.userInputChange.emit(this.userInput);
    this.handleTypingState();
  }

  /*  Handle the sending of typing indicator events.

      PARAMS
        event (event object)

      RETURN
        none
  */
  private handleTypingState() {

    if (!Utils.isEmpty(this.userInput) && !this.wasTyping) {
      this.websocket.send('typing-on');
      this.wasTyping = true;
    } else if (Utils.isEmpty(this.userInput) && this.wasTyping) {
      this.websocket.send('typing-off');
      this.wasTyping = false;
    }
  }
}
