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
export class ReservationService {

  constructor(public httpClient: HttpClient) { }

  fetchReservationData() {
    return this.httpClient.get<any>(`http://localhost:8080/reservation`, options)
  }
}
