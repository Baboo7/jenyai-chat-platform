import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class RoomService {

  constructor(private http: HttpClient) { }

  /**************************/
  /*  interface
  /**************************/

  /*  Retrieve the name of all the rooms from the api.

      PARAMS
        none

      RETURN
        (Observable)
  */
  public getAllRoomsName(): Observable<Array<string>> {
    let observable = new Observable(observer => {
      this.http.get(`${environment.api}/rooms`).subscribe(
        (data: any) => {
          if(data.success) {
            observer.next(data.rooms);
          } else {
            observer.next([ ]);
          }
        }
      );
    });

    return observable;
  }

  /*  Try to connect a student to a room.

      PARAMS
        roomInfo (object): information to connect to a room

      RETURN
        (Observable)
  */
  public connectStudent(roomInfo): Observable<any> {
    let observable = new Observable(observer => {
      this.http.post(`${environment.api}/rooms/connect/student`, roomInfo).subscribe((data: any) => {
        observer.next(data);
      });
    });

    return observable;
  }

  /*  Try to connect a teacher to a room.

      PARAMS
        roomInfo (object): information to connect to a room

      RETURN
        (Observable)
  */
  public connectTeacher(roomInfo): Observable<any> {
    let observable = new Observable(observer => {
      this.http.post(`${environment.api}/rooms/connect/teacher`, roomInfo).subscribe((data: any) => {
        observer.next(data);
      });
    });

    return observable;
  }
}
