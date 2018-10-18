import { Injectable } from '@angular/core';
import { AppModule } from './app.module';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  public hello(): string {
    return 'Greeting';
  }
}
