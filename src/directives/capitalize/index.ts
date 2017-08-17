import { NgModule, ModuleWithProviders }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import {Capitalize} from './capitalize.directive';

@NgModule({
  imports:      [ BrowserModule,  FormsModule, ReactiveFormsModule],
  declarations: [Capitalize],
  exports: [Capitalize],
  providers:[]
})
export class CapitalizeModule {
  static forRoot(): ModuleWithProviders { return {ngModule: CapitalizeModule, providers: []}; }
}