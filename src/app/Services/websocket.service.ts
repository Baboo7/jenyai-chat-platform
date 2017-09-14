import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class WebsocketService {

  private url = 'http://localhost:8080';
  private socket;
  private id;

  constructor() {
    this.socket = io(this.url);

    this.socket.on('set-uuid', data => {
      this.id = data.id;
      console.log(this.id);
    })
  }

  onEvent(event) {
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

  send(event, obj): void {
    this.socket.emit(event, obj);
  }

  getUuid() {
    return this.id;
  }
}
