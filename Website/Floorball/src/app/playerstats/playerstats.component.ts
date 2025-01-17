import { Component, OnInit } from '@angular/core';
import { ApiserviceService, Imatch, Iplayer, Iplayerinfo, Iteam,Iplayerstats } from '../Services/apiservice.service';

@Component({
  selector: 'app-playerstats',
  templateUrl: './playerstats.component.html',
  styleUrls: ['./playerstats.component.css']
})
export class PlayerstatsComponent implements OnInit {

  photoicon : string = "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png";
  graphicon : string = "data:image/png;base64,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";

  Teamlijst : Iteam[] = null
  teaminfo : Iteam = null
  players : Iplayer[]

  player : Iplayerinfo = null

  stats : Iplayerstats[] = null
  totalhits : number = 0
  averagehits : number = 0

  constructor(private api : ApiserviceService) { }

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
        this.api.getstats(name).subscribe(d => {
          this.stats = d;
          
          console.log(this.stats);
          this.totalhits = 0;
          for (let i = 0; i < this.stats.length; i++) {
            this.totalhits += this.stats[i].hits;            
            
          }
          this.averagehits = this.totalhits/this.stats.length;
  
        });

      });
    }
  }

}
