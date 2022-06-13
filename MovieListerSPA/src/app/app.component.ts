import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'MovieListerSPA';

  constructor(private authService: AuthService) { }

  isLoggedIn: boolean = false;

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  logOut() {
    this.authService.doLogout();
    this.isLoggedIn = false;
  }
}
