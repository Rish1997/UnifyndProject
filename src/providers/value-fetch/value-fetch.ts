import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ValueFetchProvider {
  url: string = "https://api.coinmarketcap.com/v2/ticker/?limit=10";

  constructor(public http: HttpClient) {

  }

  fetchCrypts() {
    let arr = [];
    return new Promise((resolve,reject) => {
      
      this.http.get(this.url).subscribe(data => {
        
        for(let key in data["data"]){
          arr.push({type : data["data"][key].symbol , price : data["data"][key].quotes.USD.price , perChange : data["data"][key].quotes.USD.percent_change_1h , volume : data["data"][key].quotes.USD.volume_24h}); 
        }
        resolve(arr);
      })
    })
  }
  fetchCurrencies() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/predifined.json').subscribe(data => {
        resolve(data);
      })
    })
  }

}
