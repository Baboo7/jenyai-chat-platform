import { Injectable } from '@angular/core';

@Injectable()
export class TokenManager {

  private tokenKey: string = 'app_token';

  private store(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private retrieve() {
    let storedToken: string = localStorage.getItem(this.tokenKey);
    if(!storedToken) throw 'no token found';
    return storedToken;
  }

  private remove() {
    localStorage.removeItem(this.tokenKey);
  }

  public doesTokenExist(): boolean {
    try {
      this.retrieve();
      return true;
    } catch(err) {
      return false;
    }
  }

  public storeToken(token: string) {
    this.store(token);
  }

  public retrieveToken() {
    let token = null;

    try {
      let storedToken = this.retrieve();
      token = storedToken;
    } catch(err) { }

    return token;
  }

  public removeToken() {
    this.remove();
  }
}
