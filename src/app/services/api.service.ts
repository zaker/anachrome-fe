import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * getInfo
 :Observable<string>  */
  public getInfo(): Observable<string> {
    return this.http.get<string>(environment.api_address + "/tw");
  }

  public fetch(res: string, opts: any): Promise<Response> {
    return fetch(environment.api_address + res, opts);
  }
}
