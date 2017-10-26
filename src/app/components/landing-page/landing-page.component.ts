import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Component ({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  private contacted: boolean = false
  private name: string;
  private email: string;
  private phone: string;
  private msg: string;
  private emailPatrn = /([A-Z]|[a-z]|[0-9]|-|_)+@([A-Z]|[a-z]|[0-9]|-|_)+\.([a-z])/;
  private phonePatrn = /[0-9]/;
  private url: string = 'https://player.vimeo.com/video/239555363?title=0&byline=0';

  constructor(private http: HttpClient) { }

  contact(): void {
    let body = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.msg
    };

    this.http.post(`${environment.api}/contact`, body)
    .subscribe((data: any) => {
      if (data.success) {
        this.contacted = true;
      }
    })
  }
}
