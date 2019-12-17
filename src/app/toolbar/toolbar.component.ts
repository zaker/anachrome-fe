import {Component, OnInit, Input} from '@angular/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() appName: string;
  constructor() { console.log(this); }

  public async ngOnInit(): Promise<void> {
    console.log("Toolbar init on: " + this.appName);
  }
}
