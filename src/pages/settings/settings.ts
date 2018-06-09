import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ValueFetchProvider } from './../../providers/value-fetch/value-fetch';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  Currencies = [];

  constructor(public navCtrl: NavController, public navParams: NavParams , public vfPro : ValueFetchProvider) {
    this.vfPro.fetchCurrencies().then((data) => {
      this.Currencies = data["currency"];
    })
  }

  ionViewDidLoad() {
    
  }

  currencySelected(){

  }

}
