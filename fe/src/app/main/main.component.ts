import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Image {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
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

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
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
        this.imageList = res;
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
