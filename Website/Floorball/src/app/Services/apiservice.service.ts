import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  public readonly url : string = "https://internationalprojectapi.azurewebsites.net/"

  constructor(private http: HttpClient) { }

  get Matches() : Observable<Imatch[]>{
    return this.http.get<Imatch[]>(this.url + "/api/v1/matches");

  }

  get Allteams() : Observable<Iteam[]>{
    return this.http.get<Iteam[]>(this.url + "/api/v1/teams")
  }

  Matchinfo(idinput : number) : Observable<Imatchinfo[]>
  {
    return this.http.get<Imatchinfo[]>(this.url + "/api/v1/matches/" + idinput);
  }
  teaminfo(teamname : string) : Observable<Iteam[]>
  {
    return this.http.get<Iteam[]>(this.url + "/api/v1/teams?teamName=" + teamname);
  }
  matchplayerstats(playername :string , matchid : number)  : Observable<Imatchplayerstat[]>
  {
    return this.http.get<Imatchplayerstat[]>( this.url+"/api/v1/Data?playerName="+ playername + "&matchid=" + matchid);
  }

  playerinfo(playername : string) : Observable<Iplayerinfo[]>
  {
    return this.http.get<Iplayerinfo[]>(this.url + "/api/v1/players?playerName=" + playername);
  }

  getstats(playername: string) :Observable<Iplayerstats[]>
  {
    return this.http.get<Iplayerstats[]>(this.url + "/api/v1/Data?playerName=" + playername);
  }
  
  creatematch(idinput : number) : Observable<number>
  {
    return this.http.post<any>(this.url + "/api/v1/Matches?playerId=" + idinput, null);
  }
  
  pausematch(idinput : number , activate : boolean)
  {
    return this.http.patch<any>(this.url + "/api/v1/Matches/" + idinput + "?active=" + activate, null);
  }

  activePlayer() : Observable<Iplayerinfo>
  {
    return this.http.get<Iplayerinfo>(this.url + "/api/v1/ActivePlayer");
  }

  activeMatch() : Observable<Imatchinfo>
  {
    return this.http.get<Imatchinfo>(this.url + "/api/v1/ActiveMatch");
  }

  setactiveplayer(idinput : number , activate : boolean)
  {
    return this.http.patch<Iplayerinfo>(this.url + "/api/v1/Players/" + idinput + "?active=" + activate, null);
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


export interface ITeaminfo {
  id: number;
  name: string;
  players?: any;
  matches?: any;
}

export interface IMatches {
  start: Date;
  id: number;
}

export interface Iplayerinfo {
  name: string;
  icon: number;
  team: ITeaminfo;
  id: number;
  matches: IMatches[];
}
export interface Iplayerstats {
  match: Imatch;
  id: number;
  hits: number;
  accel: Accel[];
  linear: Linear[];
  orient: Orient[];
}