import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class WebsocketService {

  private url = 'http://localhost:8080';
  private socket;
  private connections: number = 0;

  constructor() { }

  connect() {
    this.connections++;
    if (this.socket === undefined) {
      this.socket = io(this.url);
    }
  }

  disconnect() {
    this.connections--;
    if (this.connections <= 0) {
      this.connections = 0;
      this.socket.disconnect();
    }
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
