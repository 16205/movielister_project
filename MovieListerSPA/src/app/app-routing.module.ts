import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesComponent } from './components/movies/movies.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddMovieComponent } from './components/add-movie/add-movie.component';
import { GenresComponent } from './components/genres/genres.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { EditMovieComponent } from './components/edit-movie/edit-movie.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'movies',
    component: MoviesComponent
  },
  {
    path: 'movies/add',
    component: AddMovieComponent
  },
  {
    path: 'movies/movie/:id',
    component: MovieDetailComponent
  },
  {
    path: 'movies/movie/:id/edit',
    component: EditMovieComponent
  },
  {
    path: 'genres',
    component: GenresComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
