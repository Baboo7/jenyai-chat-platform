import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenManager } from '../services/token-manager.service';

@Injectable()
export class TeacherAuthGuard implements CanActivate {

  constructor(private tokenManager: TokenManager, private router: Router) { }

  canActivate(): boolean {
    let info = this.tokenManager.extractTokenInfo();

    if (info === null || info.userType !== 'teacher') {
      this.router.navigate([ '/teacher' ]);
      return false;
    }
    else {
      return true;
    }
  }
}
