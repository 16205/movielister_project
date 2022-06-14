import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { RestService } from 'src/app/shared/rest.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  addMovieForm: FormGroup;

  genres: any = [];

  constructor(
    public fb: FormBuilder,
    public restService: RestService,
    private router: Router
  ) {
    this.addMovieForm = this.fb.group({
      title: [''],
      director: [''],
      description: [''],
      year: [2022],
      genres: this.fb.array([''])
    });
  }

  ngOnInit() {
    this.getGenres();
    console.log(this.genres);
  }

  // get genresFormArray(): FormArray {
  //   return this.addMovieForm.get('genres') as FormArray;
  // }

  getGenres() {
    this.restService.getGenres().subscribe(
      res => {
        // console.log(res);
        this.genres = res;
      }
    );
  }

  // newGenre():FormGroup {
  //   return this.fb.group({
  //     name: ['']
  //   });
  // }

  // addGenres() {
  //   this.genresFormArray.push(this.newGenre());
  // }

  addMovie() {
    console.log("ok");
    this.restService.addMovie(this.addMovieForm.value).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/movies']);
      }
    );
  }

}
