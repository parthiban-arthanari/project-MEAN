import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  @ViewChild('f', {static : false}) postForm : NgForm
  @Output() postCreated = new EventEmitter<Post>();
  entTitle : string = '';
  entContent : string = '';

  constructor(private postService : PostService){}
  onAddPost(form : NgForm){
    if(form.invalid){
      return;
    }
  // const post : Post = {
  //   title : form.value.title,
  //   content : form.value.content
  // };
  this.postService.addPost(form.value.title,form.value.content)
  }
}
