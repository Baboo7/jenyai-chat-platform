import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenManager } from '../services/token-manager.service';

@Injectable()
export class StudentAuthGuard implements CanActivate {

  constructor(private tokenManager: TokenManager, private router: Router) { }

  canActivate(): boolean {
    let info = this.tokenManager.extractTokenInfo();

    if (info === null || info.userType !== 'student') {
      this.router.navigate([ '/student' ]);
      return false;
    }
    else {
      return true;
    }
  }
}
