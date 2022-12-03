import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(public httpClient: HttpClient) { }

  fetchMenuData() {
    return this.httpClient.get<any>(`http://localhost:8080/menus`, options)
  }
}
