import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  newsData : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http : HttpClient) {
  }

  ionViewDidLoad() {
    this.http.get("https://newsapi.org/v2/everything?sources=crypto-coins-news&apiKey=b8ebac75c18945c2a9526038fb90d265").subscribe((news) => {
      this.newsData = news["articles"];
      console.log(this.newsData);
    })
  }

}
