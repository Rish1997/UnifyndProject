import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ValueFetchProvider {
  url: string = "https://blockchain.info/ticker";

  constructor(public http: HttpClient) {

  }

  fetch() {
    // this.http.get(this.url).subscribe(data => {
    //   console.log(data);
    // })
    console.log("Just uncomment above section. This is working fine");
  }
  fetchCurrencies() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/predifined.json').subscribe(data => {
        resolve(data);
      })
    })
  }

}
