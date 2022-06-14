import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const endpoint = 'http://localhost:3000/api/';

export interface Movie {
  id: number;
  title: string;
  director: string;
  description: string;
  year: number;
  genres: Genre[];
}


export interface Genre {
  name: string;
  movies: Movie[];
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  getMovies(): Observable<any> {
    return this.http.get<Movie>(endpoint + "movies");
  }

  getMovie(id: number): Observable<any> {
    return this.http.get<Movie>(endpoint + "movies/movie/?id=" + id);
  }

  addMovie(movie: Movie): Observable<any> {
    return this.http.post(endpoint + "movies/new", movie);
  }

  editMovie(movie: Movie): Observable<any> {
    return this.http.put(endpoint + "movies/edit", movie);
  }

  getGenres(): Observable<any> {
    return this.http.get<Genre>(endpoint + "genres");
  }
}
