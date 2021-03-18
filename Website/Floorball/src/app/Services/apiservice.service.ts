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
}

export interface Imatch {
  start: Date;
  teams: string[];
}

