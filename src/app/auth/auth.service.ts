import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthModel } from "./auth-data.model";

const  BACKEND_URL = "http://localhost:3000/api/user/";

@Injectable({
  providedIn: 'root'
})
export class Authservice{
  private isAuthenticated = false;
  private userId : string;
  private token : string;
  private tokenTimer : NodeJS.Timer
  private authStatusListener = new Subject<boolean>();

  constructor(private http : HttpClient , private router : Router){}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email : string , password : string){
    const authData : AuthModel = {email : email , password : password}
    this.http.post( BACKEND_URL + "/signup" , authData)
    .subscribe(() => {
      this.router.navigate(["/"]);
    }, error => {
      this.authStatusListener.next(false);
    }
    );
    // .subscribe(res => {
    //   console.log(res);
    // },error => {
    //   console.log(error);
    // });
  }

  login(email : string , password : string){
    const authData : AuthModel = {email : email , password : password}
    this.http.post<{token : string , expiresIn : number , userId : string}>(BACKEND_URL + "/login", authData).subscribe(res => {
      const token = res.token;
      this.token = token;
      if (token){
        const expirationDuration = res.expiresIn;
        this.setAuthTimer(expirationDuration);
        this.isAuthenticated = true;
        this.userId = res.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date (now.getTime() + expirationDuration * 1000)
        this.saveAuthData(token, expirationDate,this.userId);
        console.log(expirationDate);
        this.router.navigate(["/"]);
      }
    },error => {
      this.authStatusListener.next(false);
    }
    );
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation){
      return ;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration : number){
    console.log("Setting Timer :" + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  private saveAuthData(token : string , expirationDate : Date , userId : string){
    localStorage.setItem("token" , token);
    localStorage.setItem("expiration" , expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate){
      return ;
    }
    return {
      token : token,
      expirationDate : new Date(expirationDate),
      userId : userId
    }
  }
}
