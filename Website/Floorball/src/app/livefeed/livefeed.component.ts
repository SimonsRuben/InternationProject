import { Component, OnInit } from '@angular/core';
import * as Jquery from 'jquery';
import * as CanvasJS from 'canvasjs/dist/canvasjs.min';
import { ApiserviceService, Imatchinfo, Iplayer, Imatchplayerstat, Iplayerinfo, Iteam } from '../Services/apiservice.service';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-livefeed',
  templateUrl: './livefeed.component.html',
  styleUrls: ['./livefeed.component.css']
})
export class LivefeedComponent implements OnInit {

  player : Iplayer = {name: "", id: 0, icon: 0};
  playerDetailed : Iplayerinfo = {name: "", id: 0, icon: 0, team: null, matches: null};
  match : Imatchinfo = {id: 0, start: new Date(), teams: null, players: null}
  stats : Imatchplayerstat;

  /*accelX : any[] = [];
  accelY : any[] = [];
  accelZ : any[] = [];*/
  cumAccel : any[] = [];
  cumLinear : any[] = [];
  cumOrient : any[] = [];
  hits : any[] = [{x: 0, y: 0}];

  highestLinear : number = 0;
  totalLinear : number = 0;

  chartAcc : CanvasJS.chart;
  chartLin : CanvasJS.chart;
  chartOri : CanvasJS.chart;
  chartHit : CanvasJS.chart;

  photoicon : string = "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png";
  graphicon : string = "data:image/png;base64,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";
  floorballmap : string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATkAAAChCAMAAACLfThZAAAAYFBMVEX///+EhISbm5vV1dX09PTAwMDExMTQ0NDw8PC1tbWLi4vKysqioqKOjo7Nzc3g4ODm5ub5+fl8fHyurq7c3Nzr6+uAgIBdXV10dHRtbW2mpqazs7OVlZWYmJhoaGhCQkKbMrG4AAAFEklEQVR4nO2d63aiMBRGEwHlptwR8TLv/5ZDhY4tTUDPaHKK3/6hNrCWh92QkECOQgDAArdaF8XKLrnl7+9oWy/xH/FWbmXrlalrlSzP7AbQUSVRsW0C9z5tWdwUd+76WqTtAD6JpCzn98rafPP6WO6CjTkh/HOdzOzi5GsjodwDI3NCVGGcTW3fnlicpz2szAnhNal2W3aJDEYyCzNzwj3ozsfkUhmNZA5u5rpTslUWJ5KXOIbmRBErCqvmoUs+AzA0JwpFrdtzE8fSnDh545Jc33HYgqU50Ywu7IrAThxT8DSXfW/VytBWIBPwNCd2p69/1fzOVbbmxNm5fY4Ke3Ho4WrOvdw+H9S7rB11uSG4mhPBv/5VV+XWdmdNrJtzNWP8LP/8VGv2ePc6d9TNLK2G6Tpf17FGb24u0JmrVv27p5oCSHMpLwcpc3tDC+tXSoH2iqPuJ+POujk5i3WulTL8E1r8v5W1lPumqzlKOfHVqas9Kyy3c4zrXHTtXVP1pJNA36pt5wZnjnbImtgdWVg3p+1bRXYdgW343LP5jnVzO/1U7zU2y+ekHuvmJoA5KjBHBeaowBwVmKMCc1RgjgrMUYE5KjBHBeaowBwVmKMCc1RgjgrMUYE5KjBHBeaowBwVmKMCc1RgjgrMUYE5KjBHBeaowBwVmKOiNVdtnEnMRWeExw9Xay5cTxEdjDy+a87c3OH+fFZYa247/U3t0sxNb46fZy6GuY8XmIM5MjBHBeaowBwVmKPyAnND7rzx+telmxsdNsFcsu+TJh5Gma4Wbi469Ie9H1YvUcwNS8I2b2ZuMBL8v7ndm5nb9e8wN8vzzaVvbm5Ypbp60JxXy8OQmONNzXmHfjU66pyWmTr3y9q5ane5I4nvc1hUD+GFTuNJQ5lml2TOOX1El9Wv/p6eJZkLs2t0gZl7RQsyl32k7+miS35ktXwJCzJ3DaCLzjGT12JJ5uLkGt3WTMaUJZnL8rQ7nthQLsYlmRPutt2HpnLQLMrc18yCLwcjfipPHn1hxI8R/yzLGvFzMPdLe4hFmMMdnDFz5vxcXslHyf8Wbi75POzhMHGPXwuejqACc1RgjgrMUYE5KjBHxZw5rIfAGpyeJ67Bwbov6rovFvzKtYYsgDkqMEcF5qjAHBWYowJzVGCOCsxRgTkqMEcF5qjAHBWYowJzVGCOCsxRgTkqMEcF5qjAHBWYowJzVGCOCsxRgTkqMEcF5qjAHBX25iKYe5xrbI6Z/AyPw95cebQdhgbG5vz447U62Y5DA2NzSZ+agWuEXOPqCPrFl22i2V6ayRaiw7o5p9JtOfWPmDu6rCCWr1esmzvqqpRo+jdXl95ibeYZdB3WzQU6c9GwYlqcNXtEds3NrO94PYGutZKfOZorxX83zaW8HG7rig3TShn+CW19e0dZS7lv+qwbY9LbEqVQLRd1Tl0e3noOX51bEO2cstj5egF8jlS7vHvfqjaXfWtCslrVoFg+W62b85TmVt/H+aW5xFt3Y92cEmfc/K75jV5ZmqsuP4pW7CabOJrzG8WI7GQqw+C9MDTnN8q82qdAVWoPfub8RtNnrmaW7xuGnblkr508iRprox0F3MwVU7nIS8mon+BlLglnUvQW44xp9uBkLovnvbihZHIbkY85f9Xc5cQt6nYz/nE0CzAxlx7D8O5haJYWJxkfPaus92u7AXQci1C20YO/7+GmyXT6k5czk37FBGWqvQ4BZP4CjMpFgbcMIAwAAAAASUVORK5CYII=";

  constructor(private api : ApiserviceService) { }

  ngOnInit(): void {
    this.api.activePlayer().subscribe(d => this.player = d);
    //this.api.playerinfo(this.player.name).subscribe(d => this.playerDetailed = d[0]);
    this.api.activeMatch().subscribe(d => this.match = d);

    //this.statUpdate();

    this.chartAcc = new CanvasJS.Chart("graphAcc",{
      title:{
        text:"Live Acceleration Chart"
      },
      axisX:{
        labelFormatter: function(){
          return "";
        }
      },
      data: [/*{
        //showInLegend: true,
        name: "X",
        type: "line",
        dataPoints : this.accelX
      },
      {
        //showInLegend: true,
        name: "Y",
        type: "line",
        dataPoints: this.accelY
      },
      {
        //showInLegend: true,
        name: "Z",
        type: "line",
        dataPoints: this.accelZ
      },*/
      {
        //showInLegend: true,
        name: "Total",
        type: "line",
        dataPoints: this.cumAccel
      }]
    });

    this.chartLin = new CanvasJS.Chart("graphLin", {
      title:{
        text:"Live Linear Velocity Chart"
      },
      axisX:{
        labelFormatter: function(){
          return "";
        }
      },
      data: [{
          //showInLegend: true,
          name: "Total",
          type: "line",
          dataPoints: this.cumLinear
        }]
    })

    this.chartOri = new CanvasJS.Chart("graphOri", {
      title:{
        text: "Live Orientational Velocity Chart"
      },
      axisX:{
        labelFormatter: function(){
          return "";
        }
      },
      data: [{
          //showInLegend: true,
          name: "Total",
          type: "line",
          dataPoints: this.cumOrient
        }]
    })

    this.chartHit = new CanvasJS.Chart("graphHit", {
      title:{
        text: "Live Hits Chart"
      },
      axisX:{
        labelFormatter: function(){
          return "";
        }
      },
      data: [{
          //showInLegend: true,
          name: "Total",
          type: "line",
          dataPoints: this.hits
        }]
    })

    this.chartAcc.render();
    this.chartLin.render();
    this.chartOri.render();
    this.chartHit.render();

    setInterval(d => {this.UpdateChart()}, 5000);
  }

  statUpdate(): void {
    this.api.matchplayerstats(this.player.name, this.match.id).subscribe(d => this.stats = d[0]);
    this.api.playerinfo(this.player.name).subscribe(d => this.playerDetailed = d[0]);
  }

  dataSeriesUpdate(): void {
    for(var i = this.cumAccel.length; i < this.stats.accel.length; i++)
    {
      this.cumAccel.push({
        x: this.totalMilliseconds(this.stats.accel[i].time.toString()),
        y: Math.sqrt(Math.pow(this.stats.accel[i].x, 2) + Math.pow(this.stats.accel[i].y, 2) + Math.pow(this.stats.accel[i].z, 2))
      })
    }

    for(var i = this.cumLinear.length; i < this.stats.linear.length; i++)
    {
      this.cumLinear.push({
        x: this.totalMilliseconds(this.stats.linear[i].time.toString()),
        y: Math.sqrt(Math.pow(this.stats.linear[i].x, 2) + Math.pow(this.stats.linear[i].y, 2) + Math.pow(this.stats.linear[i].z, 2))
      })

      if(Math.sqrt(Math.pow(this.stats.linear[i].x, 2) + Math.pow(this.stats.linear[i].y, 2) + Math.pow(this.stats.linear[i].z, 2)) > this.highestLinear)
      {
        this.highestLinear = Math.sqrt(Math.pow(this.stats.linear[i].x, 2) + Math.pow(this.stats.linear[i].y, 2) + Math.pow(this.stats.linear[i].z, 2));
      }

      this.totalLinear = this.totalLinear + Math.sqrt(Math.pow(this.stats.linear[i].x, 2) + Math.pow(this.stats.linear[i].y, 2) + Math.pow(this.stats.linear[i].z, 2));
    }

    for(var i = this.cumOrient.length; i < this.stats.linear.length; i++)
    {
      this.cumOrient.push({
        x: this.totalMilliseconds(this.stats.orient[i].time.toString()),
        y: Math.sqrt(Math.pow(this.stats.orient[i].x, 2) + Math.pow(this.stats.orient[i].y, 2) + Math.pow(this.stats.orient[i].z, 2))
      })
    }

    if(this.hits[this.hits.length - 1].y < this.stats.hits)
    {
      if(this.hits.length == 1)
        this.hits[0] = {
          x: this.totalMilliseconds(this.match.start.toString()),
          y: 0
        };
      this.hits.push({
        x: this.totalMilliseconds(this.stats.start.toString()),
        y: this.stats.hits
      });
    }
  }

  UpdateChart(): void
  {
    if (this.player != null && this.player.name != null) {
      this.statUpdate();
    }

    if (this.stats != null && this.player != null) {
      this.dataSeriesUpdate();
    }
    

    this.chartAcc.render();
    this.chartLin.render();
    this.chartOri.render();
    this.chartHit.render();
  }

  totalMilliseconds(time: string) : Number
  {
    var splitString = time.split('T');
    var times = splitString[1].split(':');
    return (parseInt(times[0]) * 3600 + parseInt(times[1]) * 60 + parseInt(times[2].split('.')[0])) * 1000 + parseFloat(times[2].split('.')[1]) / 10000;
  }
}