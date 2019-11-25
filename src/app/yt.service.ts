import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, forkJoin, of } from 'rxjs';
import { takeUntil, map, switchMap} from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from "lodash";
import { CONFIGURATION } from './configuration';
import { HttpHeaders } from '@angular/common/http';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  constructor(private http: HttpClient, private userService : UserService) { }

  public getVideosForChannel(channel, maxResults): Observable<Object> {
    let url = CONFIGURATION.API_URL + '/search?key=' + CONFIGURATION.API_KEY + '&channelId=' + channel + '&order=date&part=snippet &type=video,id&maxResults=' + maxResults
    return this.http.get(url)
      .pipe(map((res) => {
        return res;
      }))
  }

  public getMySubscribers(maxResults): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userService.getToken(),
        'Accept' : 'application/json'
      })
    }


    let url = CONFIGURATION.API_URL + '/subscriptions?key=' + CONFIGURATION.API_KEY + '&mySubscribers=true&part=snippet &maxResults=' + maxResults

    console.log(httpOptions, url);

    return this.http.get(url, httpOptions)
      .pipe(map((res) => {
        return res;
      }))
  }

  public getSubscriptions(maxResults): Observable<Object> {
    let url = CONFIGURATION.API_URL + '/subscriptions?key=' + CONFIGURATION.API_KEY + '&mine=true&part=snippet &maxResults=' + maxResults
    return this.http.get(url)
      .pipe(map((res : any) => {
        return res.items;
      }))
  }

}
