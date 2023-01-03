import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Authservice } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title : 'First Post' , content : 'First post Content'},
  //   {title : 'Second Post' , content : 'Second post Content'},
  //   {title : 'Third Post' , content : 'Third post Content'}
  // ]

  private subscription : Subscription;
  isLoading = false;
  posts: Post[] = [];
  totalPost = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private authSub : Subscription;
  userIsAuthenticated = false;

  constructor(public postService: PostService , private authService : Authservice) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPost(this.postPerPage,this.currentPage);
    this.subscription = this.postService.getPostUpdated().subscribe(( postData: {posts:Post[],postCount : number}) => {
      this.isLoading = false;
      this.totalPost = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onChangedPage(pageData : PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPost(this.postPerPage,this.currentPage);
  }

  onDelete(postId : string){
    this.postService.onDeletePost(postId).subscribe(()=>{
      this.postService.getPost(this.postPerPage,this.currentPage);
    });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
      this.authSub.unsubscribe();
  }

}
