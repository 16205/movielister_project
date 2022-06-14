import { Component, OnInit } from '@angular/core';
import { RestService, Genre } from '../../shared/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css']
})
export class GenresComponent implements OnInit {

  genres: Genre[] = [];

  constructor(public rest: RestService, private router: Router) { }

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres() {
    this.rest.getGenres().subscribe(
      res => {
        // console.log(data);
        this.genres = res;
      }
    );
  }
}
