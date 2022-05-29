import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DotChartComponent } from './components/charts/dot-chart/dot-chart.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { PercentageStackedBarComponent } from './components/charts/chart_01/percentage-stacked-bar/percentage-stacked-bar.component';
import { CommentStackedBarComponent } from './components/charts/chart_01/comment-stacked-bar/comment-stacked-bar.component';
import { PercentageLineComponent } from './components/charts/chart_01/percentage-line/percentage-line.component';

@NgModule({
  declarations: [
    AppComponent,
    DotChartComponent,
    WorkspaceComponent,
    PercentageStackedBarComponent,
    CommentStackedBarComponent,
    PercentageLineComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
