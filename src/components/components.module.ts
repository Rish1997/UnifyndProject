import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExchangeComponent } from './exchange/exchange';
import { IonicModule } from 'ionic-angular';
// import { CommonModule } from 'angular/common';
@NgModule({
	declarations: [ExchangeComponent],
	imports: [CommonModule,IonicModule],
	exports: [ExchangeComponent]
})
export class ComponentsModule {}
