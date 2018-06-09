import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NavController , IonicApp } from 'ionic-angular';
import { ValueFetchProvider } from '../../providers/value-fetch/value-fetch';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  CurrencyOptions = [];
  YourCoins = [];
  CryptData = {};

  constructor(public navCtrl: NavController, public vfPro : ValueFetchProvider) {
    
    this.compareValues();
  }

  ionViewDidLoad(){
    this.YourCoins = [{number : 0.0008 , type : "BTC"}, {number : 20 , type : "ETH"}];
  }

  compareValues() {
    this.vfPro.fetchCrypts().then((data) => {
      for(let values in data){
         this.CryptData[data[values].type] = data[values]; 
      }
      console.log(this.CryptData)
    })
    this.vfPro.fetchCurrencies().then((data) => {
      this.CurrencyOptions = data["currency"];
    })
  }

  valuesSelected(ev) {

  }

  openSettings(){

  }

  

}
