import { Component, OnInit } from '@angular/core';
import { ApiserviceService, Imatch, Imatchplayerstat, Iteam } from '../Services/apiservice.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  matcheslijst : Imatch[];
  matchnumber : number;
  team1 : Iteam =  null;
  team2 : Iteam = null;
  pickedteamname :string;

  playerstats : Imatchplayerstat = null;

  photoicon : string = "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png";
  
  constructor(private api : ApiserviceService) { }

  ngOnInit(): void {
    this.api.Matches.subscribe(d => {
      this.matcheslijst = d;
      //console.log(this.matcheslijst);
    });

    
  }

  getmatchplayer(plname : string,team :string)
  {
    this.api.matchplayerstats(plname,this.matchnumber).subscribe(d => {
      console.log(d[0]);
      this.playerstats = d[0];
      this.pickedteamname = team;
      //console.log(this.matcheslijst);
    });
  }



  viewmatch(idmatch : number)
  {
    this.matchnumber = idmatch;
    var temp1;
    var temp2;
    this.api.Matchinfo(this.matchnumber).subscribe(d => {
      temp1 = d[0].teams[0];
      temp2 = d[0].teams[1];
      //console.log(this.matcheslijst);
      this.api.teaminfo(temp1).subscribe(d => {
        this.team1 = d[0];      //console.log(this.matcheslijst);
        console.log(this.team1);
      });
      if (temp2 != undefined) {
        this.api.teaminfo(temp2).subscribe(d => {
          this.team2 = d[0]; 
          console.log(this.team2);
        });
      }
      
 
      
    });
  }




}
