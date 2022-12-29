import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsUpdated = new Subject<Post[]>();
  private posts : Post[]=[]

  constructor(private http : HttpClient, private router : Router){}

  getPost(){
    this.http.get<{message:string;posts:any}>("http://localhost:3000/api/posts")
    .pipe(map(postData=>{
      return postData.posts.map(post =>{
        return {
          title:post.title,
          content:post.content,
          id:post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe(transformedPost=>{
      this.posts = transformedPost;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdated(){
    return this.postsUpdated.asObservable();
  }

  getPosts(id : string){
    return this.http.get<{
      imagePath: string;_id : string,title : string,content : string
}>
    ('http://localhost:3000/api/posts/' + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath : image
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  addPost(title : string,content : string, image : File){
    const postData = new FormData();
    postData.append("title" , title);
    postData.append("content" , content);
    postData.append("image", image , title);
    this.http.post<{message: string;post : Post}>('http://localhost:3000/api/posts',postData)
    .subscribe(responseData=>{
      const post : Post = {
        id : responseData.post.id,
        title:title,
        content : content,
        imagePath: responseData.post.imagePath};
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    }
    );
  }

  onDeletePost(postId : string){
    this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe(()=>{
      const updatedPost = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
