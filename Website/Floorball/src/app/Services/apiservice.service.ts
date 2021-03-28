import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private http: HttpClient) { }

  get Matches() : Observable<Imatch[]>{
    return this.http.get<Imatch[]>("http://localhost:61379/api/v1/matches");

  }

  Matchinfo(idinput : number) : Observable<Imatchinfo[]>
  {
    return this.http.get<Imatchinfo[]>("http://localhost:61379/api/v1/matches/" + idinput);
  }
  teaminfo(teamname : string) : Observable<Iteam[]>
  {
    return this.http.get<Iteam[]>("http://localhost:61379/api/v1/teams?teamName=" + teamname);
  }
  matchplayerstats(playername :string , matchid : number)  : Observable<Imatchplayerstat[]>
  {
    return this.http.get<Imatchplayerstat[]>("http://localhost:61379/api/v1/Data?playername="+ playername + "&matchid=" + matchid);
  }
  
}

export interface Imatch {
  start: Date;
  teams: string[];
}
export interface Imatchinfo {
  id: number;
  start: Date;
  teams: string[];
  players: string[];
}
export interface Iplayer {
  name: string;
  id: number;
  icon: number;
  matches?: any;
}
export interface Iteam {
  name: string;
  players: Iplayer[];
}

export interface Accel {
  id: number;
  x: number;
  y: number;
  z: number;
  time: Date;
}

export interface Linear {
  id: number;
  x: number;
  y: number;
  z: number;
  time: Date;
}

export interface Orient {
  id: number;
  x: number;
  y: number;
  z: number;
  time: Date;
}

export interface Imatchplayerstat {
  start: Date;
  name: string;
  id: number;
  icon: number;
  accel: Accel[];
  linear: Linear[];
  orient: Orient[];
  hits: number;
}


