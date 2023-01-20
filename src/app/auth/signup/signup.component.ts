import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Authservice } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit , OnDestroy {

  authStatusSub : Subscription;
  isLoading = false;

  constructor(public authService : Authservice){}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form : NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email,form.value.password);
  }

  ngOnDestroy(){
      this.authStatusSub.unsubscribe();
  }
}
