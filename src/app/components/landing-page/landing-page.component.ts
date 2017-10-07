import { Component } from '@angular/core';

@Component ({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  private contacted: boolean = false;

  private emailPatrn = /([A-Z]|[a-z]|[0-9]|-|_)+@([A-Z]|[a-z]|[0-9]|-|_)+\.([a-z])/;
  private phonePatrn = /[0-9]/;

  contact(): void {
    this.contacted = true;
  }
}
