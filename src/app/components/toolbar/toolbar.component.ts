import { Component,  Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.css"],
})
export class ToolbarComponent {
  @Output() toggleSidenav = new EventEmitter();
  @Input() appName: string;
  opened: boolean = true;
  constructor() {
  
  }

  public async ngOnInit(): Promise<void> {
    console.log("Toolbar init on: " + this.appName);
  }

 
}
