import { NgModule, ModuleWithProviders }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }          from '@angular/forms';
import {CapitalizePipe} from './capitalize.pipe';

@NgModule({
  imports:      [ BrowserModule,  FormsModule, ReactiveFormsModule],
  declarations: [CapitalizePipe],
  exports: [CapitalizePipe],
  providers:[]
})
export class CapitalizePipeModule {
  static forRoot(): ModuleWithProviders { return {ngModule: CapitalizePipeModule, providers: []}; }
}