import { Component } from '@angular/core';
import { YoutubeService } from '.././yt.service';
import { UserService } from '.././user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private subscribers : Array<any> = [];
  private subscriptions : Array<any> = [];

  constructor(private userService : UserService, private youtubeService : YoutubeService) {

    if (this.userService.isUserSignedIn()) {
      this.loadVideos();
    }
  }

  public isLoggedIn(): boolean {
    return this.userService.isUserSignedIn();
  }

  public signIn() {
    this.userService.signIn().then(() => {
      this.loadVideos();
    });
  }

  public signOut() {
    this.userService.signOut();
  }

  private loadVideos() {
    this.getSubscribers(null);
    this.getSubscriptions(null);
  }

  private getSubscribers(nextPageToken) {
    this.youtubeService.getMySubscribers(50, nextPageToken).subscribe((res: any) => {
      for (let i = 0; i< res.items.length; i++) {
        this.subscribers.push(res.items[i].snippet.channelId)
      }

      if (res.nextPageToken) {
        this.getSubscribers(res.nextPageToken);
      }
    })
  }

  private getSubscriptions(nextPageToken) {
    this.youtubeService.getSubscriptions(50, nextPageToken).subscribe((res: any) => {

      for (let i = 0; i< res.items.length; i++) {
        this.subscriptions.push(res.items[i].snippet.resourceId.channelId)
      }

      if (res.nextPageToken) {
        this.getSubscriptions(res.nextPageToken);
      }

      console.log(this.subscriptions);
    })
  }
}
