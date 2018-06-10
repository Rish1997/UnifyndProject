import { NewsPage } from './../news/news';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NavController, PopoverController , IonicApp } from 'ionic-angular';
import { ValueFetchProvider } from '../../providers/value-fetch/value-fetch';
import { SettingsPage } from './../settings/settings';
import { TransactProvider } from '../../providers/transact/transact';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  Currencies = ["BTC", "LTC", "XRP", "XLM", "ETH", "MIOTA", "EOS", "BCH", "TRX", "ADA"];
  YourCoins = [];
  CryptData = {};
  personData = {};
  coinToBeBrought:string = "Bitcoin";
  currentCoin : any;
  segment : any = "camera";
  textClick = false;
  transactionData = [];
  portfolio = [];

  constructor(public navCtrl: NavController, public vfPro : ValueFetchProvider, public popoverCtrl: PopoverController, public trans : TransactProvider) {
    
    this.compareValues();
    this.getMyCoins();
    

    for(let index in this.Currencies){
      this.CryptData[this.Currencies[index]] = {type : "" , price : "" , perChange : "" , volume : ""};
    }
  }

  ionViewDidLoad(){
    this.YourCoins = [{number : 0.0008 , type : "BTC"}, {number : 20 , type : "ETH"}];
    
  }

  compareValues() {
    let maar = [];
    this.vfPro.fetchCrypts().then((data) => {
      for(let values in data){
         maar.push(data[values].type);
         this.CryptData[data[values].type] = data[values]; 
      }
      console.log(this.CryptData)
      console.log(maar);
    })
    
  }

  openSettings(myEvent){
    const popover = this.popoverCtrl.create(SettingsPage);
    popover.present({
      ev: myEvent
    });
  }

  getMyCoins(){
    this.trans.getPerson("Rishabh Chaturvedi").subscribe((data) => {
      this.personData = data;

      for(let i in this.personData["transactions"]){
        this.transactionData.push(this.personData["transactions"][i]);
      }
      for(let j in this.personData['portfolio']){
        this.portfolio.push(j)
      }
      console.log(this.transactionData);
      console.log(this.portfolio)
      console.log(this.personData)
    })
  }

  CoinChanged(ev){
    this.coinToBeBrought = ev;
    this.findCoinProps(this.coinToBeBrought);

  }
  
  findCoinProps(coin){
    for(let data in this.CryptData){
      if(this.CryptData[data].type == coin){
        this.currentCoin = data;
      }
    }
  }

  buyCoin(){
    let amount = 1;
    this.trans.buyCoin("Rishabh Chaturvedi",this.currentCoin.name,this.currentCoin.price, amount);
  }

  sellCoin(){
    let amount = 1;
    this.trans.sellCoin("Rishabh Chaturvedi",this.currentCoin.name,this.currentCoin.price,amount);
  }

  changePage(){
    this.navCtrl.push(NewsPage);
  }

  ShowProfits(){
    this.textClick = !this.textClick;
  }

  

}
