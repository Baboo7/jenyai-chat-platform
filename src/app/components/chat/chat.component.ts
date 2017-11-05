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

  toggleSpeechRecognition(): void {
    this.recording = !this.recording;

    if (this.recording) {
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
      this.recordSession.unsubscribe();
    }
  }

  private sendMessage(): void {
    if (Utils.isEmpty(this.userInput)) {
      return;
    }

    let msg = {
      type: 'text',
      payload: this.userInput
    };

    this.websocket.send('message', msg);
    this.userInput = '';
  }

  private handleTypingState() {
    if (!Utils.isEmpty(this.userInput) && !this.wasTyping) {
      this.websocket.send('typing-on');
      this.wasTyping = true;
    } else if (Utils.isEmpty(this.userInput) && this.wasTyping) {
      this.websocket.send('typing-off');
      this.wasTyping = false;
    }
  }

  private handleKeyDown(event): void {
    if (event.keyCode === 13) {
      this.sendMessage();
    }

    this.handleTypingState();
  }

  private handleInput(event): void {
    this.userInput = event.target.value;
    this.userInputChange.emit(this.userInput);
    this.handleTypingState();
  }
}
