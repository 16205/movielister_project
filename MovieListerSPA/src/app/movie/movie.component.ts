import { Component, OnInit } from '@angular/core';
import { RestService, Movie } from '../rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movies: Movie[] = [];

  constructor(public rest: RestService, private router: Router) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.rest.getMovies().subscribe(
      data => {
        console.log(data);
        this.movies = data;
      }
    );
  }
}
