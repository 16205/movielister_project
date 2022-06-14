import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Movie, RestService } from 'src/app/shared/rest.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie!: Movie;

  constructor(public restService: RestService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.getMovie();
  }

  getMovie() {
    this.restService.getMovie(this.route.snapshot.params['id']).subscribe(
      (res) => {
        this.movie = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
