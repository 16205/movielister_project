import { Injectable } from '@angular/core';
import { User } from './user';
import { NewUser } from './NewUser';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint: string = 'http://localhost:3000/api/users/';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) { }

  // Sign up
  signUp(user: NewUser): Observable<any> {
    return this.http.post(this.endpoint + 'register', user).pipe(catchError(this.handleError));
  }

  // Sign in
  signIn(user: User) {
    return this.http
      .post<any>(this.endpoint + 'login', user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        this.getUserProfile(res.userId).subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['movies']);
        });
      });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  // User profile
  getUserProfile(id: any): Observable<any> {
    return this.http.get(this.endpoint + 'user/?id=' + id).pipe(
      map((res) => {
        return res || {};
      }),
      // catchError(this.han dleError)
    );
  }

  // Error handling
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
