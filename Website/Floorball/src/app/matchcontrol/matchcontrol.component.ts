import { Component, OnInit } from '@angular/core';
import { ApiserviceService, Imatch, Iplayer, Iplayerinfo, Iteam, Imatchinfo, Iplayerstats } from '../Services/apiservice.service';

@Component({
  selector: 'app-matchcontrol',
  templateUrl: './matchcontrol.component.html',
  styleUrls: ['./matchcontrol.component.css']
})
export class MatchcontrolComponent implements OnInit {

  resumetext: string ="Pause match";
  constructor(public api : ApiserviceService) { }
  players : Iplayer[]
  Teamlijst : Iteam[] = null
  player : Iplayerinfo = null
  currentmatch : number = null


  ngOnInit(): void {
    this.api.Allteams.subscribe(d => {
      this.Teamlijst = d;
    });
    this.api.activeMatch().subscribe(d => {
      var match : Imatchinfo;
      match = d;
      this.currentmatch = match.id;
    });
    this.api.activePlayer().subscribe(d => {
      this.player = d;
    });
  }

  UpdatePlayer(){
    this.api.setactiveplayer(this.player.id,true).subscribe();
  }

  getallplayers(event?: any)
  {
    var name = event.target.value;
    if (name != null && name != "null") {
      this.api.teaminfo(name).subscribe(d => {
        this.players = d[0].players;
      });
    }

  }
  selectplayer(event? : any)
  {
    var name = event.target.value;
    if (name != null && name != "null") {
      this.api.playerinfo(name).subscribe(d => {
        this.player = d[0];
        this.api.getstats(name).subscribe();
      });
    }
  }
  StopMatch(){
    this.api.pausematch(this.currentmatch,false).subscribe();
    this.currentmatch = null;
  }

  CreateMatch(){
    this.api.creatematch(this.player.id).subscribe(
      d => this.currentmatch = d
    );
    this.resumetext = "Pause match"
  }

  ResumePause()
  {
    if (this.resumetext == "Pause match") {
      this.resumetext = "Resume match";
      this.api.pausematch(this.currentmatch,false).subscribe();
    } else {
      this.resumetext = "Pause match";
      if(this.currentmatch != null)
        this.api.pausematch(this.currentmatch,true).subscribe();
    }

  }

}
