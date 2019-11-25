import { Component } from '@angular/core';
import { YoutubeService } from '.././yt.service';
import { UserService } from '.././user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private userService : UserService, private youtubeService : YoutubeService) {

    if (this.userService.isUserSignedIn()) {
      this.loadVideos()
    }
  }

  public isLoggedIn(): boolean {
    return this.userService.isUserSignedIn();
  }

  public signIn() {
    this.userService.signIn().then(() => {
      this.loadVideos()
    });
  }

  public signOut() {
    this.userService.signOut();
  }

  private loadVideos() {
    this.youtubeService.getMySubscribers(50).subscribe((res) => {
      console.log("MY SUBSCRIBERS", res);
    })
  }
}
