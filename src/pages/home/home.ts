import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NavController, PopoverController , IonicApp } from 'ionic-angular';
import { ValueFetchProvider } from '../../providers/value-fetch/value-fetch';
import { SettingsPage } from './../settings/settings';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  Currencies = ["BTC", "LTC", "XRP", "XLM", "ETH", "MIOTA", "EOS", "BCH", "TRX", "ADA"];
  YourCoins = [];
  CryptData = {};

  constructor(public navCtrl: NavController, public vfPro : ValueFetchProvider, public popoverCtrl: PopoverController) {
    
    this.compareValues();

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

  

}
