import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Authservice } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy{

  isUserAuthenticated = false;
  private authStatusSubs : Subscription;
  constructor (private authService : Authservice){}

  ngOnInit(){
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated
    });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

}
