import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { RestService } from 'src/app/shared/rest.service';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
  editMovieForm: FormGroup;

  genres: any = [];

  constructor(
    public fb: FormBuilder,
    public restService: RestService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editMovieForm = this.fb.group({
      id: [''],
      title: [''],
      director: [''],
      description: [''],
      year: [2022],
      genres: this.fb.array([''])
    });
  }

  ngOnInit() {
    this.restService.getMovie(this.route.snapshot.params['id']).subscribe(
      res => {
        console.log(res);
        this.editMovieForm.setValue({
          // id: res.id,
          title: res.title,
          director: res.director,
          description: res.description,
          year: res.year,
          genres: res.genres
        });
      });
    this.getGenres();
    console.log(this.genres);
  }

  getGenres() {
    this.restService.getGenres().subscribe(
      res => {
        // console.log(res);
        this.genres = res;
      }
    );
  }

  editMovie() {
    console.log("ok");
    this.restService.editMovie(this.editMovieForm.value).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/movies']);
      }
    );
  }

}
