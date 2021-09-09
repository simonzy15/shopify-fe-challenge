import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Image {
  date: string;
  explanation: string;
  title: string;
  url: string;
  liked: boolean;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public imageList: Image[];
  public likedImages = new Set([]);
  public image: Image;

  constructor(
    private http: HttpClient,
  ) {
    this.imageList = [];
  }

  ngOnInit(): void {
    let loadLiked = JSON.parse(localStorage.getItem('likedImages'));
    if(loadLiked) {
      for(var i=0;i<loadLiked.length;i++){
        this.likedImages.add(loadLiked[i]);
      }
    }
    this.http.get<Image[]>(
      'https://api.nasa.gov/planetary/apod', 
      {
        params: {
          'start_date' : '2021-09-01',
          'end_date' : '2021-09-04',
          'api_key' : 'oRDfUpx9qgqFYOfForjA4RH75Yoeg1eyMRQGLQi2'
        }
      }
    ).subscribe(
      res => {
        for(var i=0;i<res.length;i++){
          this.image = res[i];
          if(this.likedImages.has(res[i].url)) {
            this.image.liked = true;
          }
          else {
            this.image.liked = false;
          }
          this.imageList.push(this.image);
        }
      }
    )
  }

  public handleLike(post: Image) {
    if(!post.liked) {
      this.likedImages.add(post.url);
    }
    else {
      this.likedImages.delete(post.url);
    }
    post.liked = !post.liked;

    localStorage.setItem('likedImages', JSON.stringify([...this.likedImages]));
  }
}
