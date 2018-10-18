import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Anachrome';

  constructor(private appService: AppService, private api: ApiService) {

  }

  public async ngOnInit(): Promise<void> {
    console.log(this.appService.hello());
  }

  public async ApiFetch() {
    console.log(
      await this.api.getInfo().toPromise()
    );
  }
}
