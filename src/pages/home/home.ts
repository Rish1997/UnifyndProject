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

  constructor(public navCtrl: NavController, public vfPro : ValueFetchProvider) {
    this.YourCoins = [{number : 0.0008 , type : "BTC"}, {number : 20 , type : "ETH"}];
    this.compareValues();
  }

  compareValues() {
    this.vfPro.fetch();
    this.vfPro.fetchCurrencies().then((data) => {
      this.CurrencyOptions = data["currency"];
    })
  }

  valuesSelected(ev) {

  }

  openSettings(){
    
  }

  

}
