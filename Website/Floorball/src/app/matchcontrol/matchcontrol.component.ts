import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matchcontrol',
  templateUrl: './matchcontrol.component.html',
  styleUrls: ['./matchcontrol.component.css']
})
export class MatchcontrolComponent implements OnInit {

  resumetext: string ="Pause match";
  constructor() { }

  ngOnInit(): void {
  }
  StopMatch(){

  }
  CreateMatch(){
    
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
