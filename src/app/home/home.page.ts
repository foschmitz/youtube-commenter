import { Component } from '@angular/core';
import { YoutubeService } from '.././yt.service';
import { UserService } from '.././user.service';
import { LoadingController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

interface SubscriberPage {
  subscribers: Array<any>;
  nextPageToken: string | null;
}

interface SubscriptionPage {
  subscriptions: Array<any>;
  nextPageToken: string | null;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private pageLimit = 1;
  private subscribers : Array<any> = [];
  private subscriptions : SubscriptionPage = { 'subscriptions': [], 'nextPageToken' : null };
  public commentVideos : Array<any> = [];
  private unsubscribe$: Subject<any> = new Subject();

  constructor(public loadingController: LoadingController, private userService : UserService, private youtubeService : YoutubeService, private _sanitizer: DomSanitizer) {
    if (this.userService.isUserSignedIn()) {
      this.loadVideos();
    }
  }

  private getEmbedURL(videoId) {
    return this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + videoId);
  }

  private loadSubscriberPage(nextPageToken: string | null,): Promise<SubscriberPage> {
      return new Promise((resolve, reject) => {
        this.youtubeService
          .getMySubscribers(50, nextPageToken)
          .subscribe((res: any) => {
            resolve({
              subscribers: res.items.map((item: any) => item.snippet.channelId),
              nextPageToken: res.nextPageToken,
            });
          });
      });
    }

    async loadSubscriptionPage(nextPageToken: string | null,): Promise<SubscriptionPage> {
        console.log("in loadSubscriptionPage");
        return new Promise((resolve, reject) => {
          this.youtubeService
            .getSubscriptions(this.pageLimit, nextPageToken)
            .subscribe((res: any) => {
              resolve({
                subscriptions: res.items.map((item: any) => item.snippet.resourceId.channelId),
                nextPageToken: res.nextPageToken,
              });
            });
        });
      }

    private async loadAllSubscribers(): Promise<Array<any>> {
      console.log("in loadAllSubscribers");
      const subscribers: Array<any> = [];
      let nextPageToken: string | null = null;
      do {
        const page: SubscriberPage = await this.loadSubscriberPage(nextPageToken);
        for (const subscriber of page.subscribers) {
          subscribers.push(subscriber);
        }
        nextPageToken = page.nextPageToken;
      } while (nextPageToken);
      return subscribers;
    }

    public getVideosToComment(subscriptions : SubscriptionPage, subscribers : Array<any>)  {
      console.log("in getvids");
      const nonSubscribers: Array<any> = subscriptions.subscriptions.filter(function(item) {
        return !subscribers.includes(item);
      });
      console.log("NONSUBSCRIBERS: ", nonSubscribers);

      for (var i = 0; i<nonSubscribers.length; i++) {
        this.youtubeService.getVideosForChannel(nonSubscribers[i],1)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(lista => {
          for (let element of lista["items"]) {

            this.commentVideos.push(element)
          }
        });
      }
    };

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
      message: 'Getting Videos...'
    });
    await loading.present();

    try {
      //    this.subscribers = await this.loadAllSubscribers();
          this.subscriptions = await this.loadSubscriptionPage(this.subscriptions.nextPageToken);
          this.getVideosToComment(this.subscriptions, this.subscribers);
    } catch {
        loading.dismiss();
    } finally {
        loading.dismiss();
    }

  }

  private onComment(comment, videoId) {
    console.log(comment, videoId);
  }
}
