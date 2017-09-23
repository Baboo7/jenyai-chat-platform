import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class WebsocketService {

  private url = 'http://localhost:8080';
  private socket;

  constructor() { }

  connect() {
    this.socket = io(this.url);
  }

  disconnect() {
    this.socket.disconnect();
  }

  send(event, obj): void {
    this.socket.emit(event, obj);
  }

  addListener(event) {
    let observable = new Observable(observer => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
