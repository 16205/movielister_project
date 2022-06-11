import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const endpoint = 'http://localhost:3000/api/';

export interface Movie {
  title: string;
  director: string;
  year: number;
  genres: Genre[];
}

export interface Genre {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  getMovies(): Observable<any> {
    return this.http.get<Movie>(endpoint + "movies", );
  }
}
