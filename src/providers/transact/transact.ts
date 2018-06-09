import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';


@Injectable()
export class TransactProvider {

  constructor(public http: HttpClient , public toastCtrl : ToastController) {
    
  }

  addPerson(name:string, money: number){
    let data = {
      name : name,
      money : money
    };
    this.http.post('https://us-central1-cryptohack-a896e.cloudfunctions.net/addPerson',data).subscribe((response) => {
      console.log(response);
    })
  }

  addCurrency(currencyName:string, value:number , symbol:string){
    let data = {
      currName : currencyName,
      value : value,
      symbol : symbol
    }
    this.http.post('https://us-central1-cryptohack-a896e.cloudfunctions.net/addCurrency',data).subscribe((response) => {
      console.log(response);
    })
  }

  buyCoin(buyer:string, currency:string, buyingRate:number, volume:number){
    let data = {
      name : buyer,
      currName : currency,
      rate : buyingRate,
      value : volume
    }
    this.http.post('https://us-central1-cryptohack-a896e.cloudfunctions.net/buyCoin',data).subscribe((response) => {
      let toast = this.toastCtrl.create();
      toast.setMessage(response.toString());
      toast.present();
      console.log(response);
    })
  }

  sellCoin(seller:string, currency:string, sellingRate:number, volume:number){
    let data = {
      name : seller,
      currName : currency,
      rate : sellingRate,
      value : volume
    };
    this.http.post('https://us-central1-cryptohack-a896e.cloudfunctions.net/sellCoin',data).subscribe((response) => {
      let toast = this.toastCtrl.create();
      toast.setMessage(response.toString());
      toast.present();
      console.log(response);
    })
  }

  getPerson(name:string){
    let data = {
      name : name
    };
    return this.http.post('https://us-central1-cryptohack-a896e.cloudfunctions.net/getPerson',data);
  }

}
