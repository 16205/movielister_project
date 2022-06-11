import { Component, OnInit } from '@angular/core';
import { RestService, Movie } from '../rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  movies: Movie[] = [];

  constructor(public restService: RestService, private route: Router) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.restService.getMovies().subscribe(
      data => {
        console.log(data);
        this.movies = data;
      },
    );
  }
}

