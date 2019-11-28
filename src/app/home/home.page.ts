import { Component } from '@angular/core';
import { YoutubeService } from '.././yt.service';
import { UserService } from '.././user.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private subscribers : Array<any> = [];
  private subscriptions : Array<any> = [];

  constructor(public loadingController: LoadingController, private userService : UserService, private youtubeService : YoutubeService) {

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

  async loadVideos() {
    const loading = await this.loadingController.create({
      duration: 15000,
      message: 'Please wait...'
    });
    await loading.present();
    this.getSubscribers(null);
    this.getSubscriptions(null, loading);
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

  private getSubscriptions(nextPageToken, loading) {
    this.youtubeService.getSubscriptions(50, nextPageToken).subscribe((res: any) => {

      for (let i = 0; i< res.items.length; i++) {
        this.subscriptions.push(res.items[i].snippet.resourceId.channelId)
      }

      if (res.nextPageToken) {
        this.getSubscriptions(res.nextPageToken, loading);
      } else {
        loading.dismiss();
      }

      console.log(this.subscriptions);
    })
  }
}
