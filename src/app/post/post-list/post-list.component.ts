import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  private subscription : Subscription;

  posts: Post[] = [];
  // posts = [
  //   {title : 'First Post' , content : 'First post Content'},
  //   {title : 'Second Post' , content : 'Second post Content'},
  //   {title : 'Third Post' , content : 'Third post Content'}
  // ]

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.posts = this.postService.getPost();
    this.subscription = this.postService.getPostUpdated().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

}
