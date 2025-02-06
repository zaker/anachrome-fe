import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';


const ANACHROME_ICON = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 250'><path d='M125.2-.1v249.9l105.6-54.6 19-153.8z' fill='#0f0'/><path d='M125.2-.2v27.7-.1 222.3L19.6 195.1.6 41.3z' fill='#dd0031'/><path d='M125.2 27.5L74.9 132.7H20.1V153h45.2l-8.2 17H33v20.5h43.2L93 152.8h24v-20.2h-15l23-52.2 23.3 52.2h-15.1V153h24l16.7 37.7h43.3V170h-24l-8.2-17.2h45.2v-20.2h-54.9z'/></svg>"

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css'],
    standalone: false
})
export class ToolbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter();
  @Input() appName: string = '';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('anachrome', sanitizer.bypassSecurityTrustHtml(ANACHROME_ICON));
  }

  public async ngOnInit(): Promise<void> {
    this.toggleSidenav.emit();
  }
}
