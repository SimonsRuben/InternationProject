import { Component, OnInit } from '@angular/core';
import { ApiserviceService, Imatch, Iplayer, Iplayerinfo, Iteam,Iplayerstats } from '../Services/apiservice.service';

@Component({
  selector: 'app-matchcontrol',
  templateUrl: './matchcontrol.component.html',
  styleUrls: ['./matchcontrol.component.css']
})
export class MatchcontrolComponent implements OnInit {

  resumetext: string ="Pause match";
  constructor(private api : ApiserviceService) { }
  players : Iplayer[]
  Teamlijst : Iteam[] = null
  player : Iplayerinfo = null

  ngOnInit(): void {
    this.api.Allteams.subscribe(d => {
      this.Teamlijst = d;
    });
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

  }
  CreateMatch(){
    this.api.creatematch(this.player.id).subscribe();
  }

  ResumePause()
  {
    if (this.resumetext == "Pause match") {
      this.resumetext = "Resume match";
      
    } else {
      this.resumetext = "Pause match";
    }

  }

}
