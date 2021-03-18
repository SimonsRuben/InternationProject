import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MatchcontrolComponent } from './matchcontrol/matchcontrol.component';
import { HistoryComponent } from './history/history.component';
import { PlayerstatsComponent } from './playerstats/playerstats.component';
import { LivefeedComponent } from './livefeed/livefeed.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MatchcontrolComponent,
    HistoryComponent,
    PlayerstatsComponent,
    LivefeedComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: "playerstats", component:PlayerstatsComponent},
      {path: "history", component:HistoryComponent},
      {path: "livefeed", component:LivefeedComponent},
      {path: "matchcontrol", component:MatchcontrolComponent},
      {path: "**", component:MatchcontrolComponent}
    ], {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
