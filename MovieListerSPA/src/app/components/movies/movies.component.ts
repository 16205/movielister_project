import { Component, OnInit } from '@angular/core';
import { RestService, Movie } from '../../shared/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  movies: Movie[] = [];

  constructor(public rest: RestService, private router: Router) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.rest.getMovies().subscribe(
      res => {
        // console.log(data);
        this.movies = res;
      }
    );
  }
}
