import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsUpdated = new Subject<Post[]>();
  private posts : Post[]=[
    {title: 'Test',content:'Added'}
  ]

  getPost(){
    return [...this.posts];
  }

  getPostUpdated(){
    return this.postsUpdated.asObservable();
  }

  addPost(title : string,content : string){
    const post : Post = {title:title,content : content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts])
  }
}
