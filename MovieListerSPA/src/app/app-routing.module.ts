import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesComponent } from './components/movies/movies.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddMovieComponent } from './components/add-movie/add-movie.component';
import { GenresComponent } from './components/genres/genres.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';

const routes: Routes = [
  {
    path: 'movies',
    component: MoviesComponent
  },
  {
    path: 'genres',
    component: GenresComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'movies/add',
    component: AddMovieComponent
  },
  {
    path: 'movies/movie/:id',
    component: MovieDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
