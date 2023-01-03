import { Component, OnInit } from '@angular/core';
import { Authservice } from './auth/auth.service';
import { Post } from './post/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  storedPosts : Post[]=[];

  onPostAdded(post){
    this.storedPosts.push(post)
  }

  constructor (private authService : Authservice){}

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
