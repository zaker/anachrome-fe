import { Component,  Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.css"],
})
export class ToolbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter();
  @Input() appName: string = "";

  constructor() {
  
  }

  public async ngOnInit(): Promise<void> {

    this.toggleSidenav.emit()
  }

 
}
