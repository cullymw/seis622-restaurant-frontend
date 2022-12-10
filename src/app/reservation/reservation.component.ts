import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { IReservationItem } from '../model/reservation-item'; 
import { ReservationService } from '../shared/reservation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})

export class ReservationComponent implements OnInit {
  
  public availableTimes: IReservationItem[] = [];
  public reservedTimes: IReservationItem[] = [];
  public dataLoading: boolean = false;
  public personName: string = "";
  public partyNumber: number;
  public selectedReservation: IReservationItem = {id: 0, name: "", time: "", number: 0};
  saveUnsuccessful: boolean;
  partyArray: any[];

  constructor(
    public route: ActivatedRoute,
    public reservationService: ReservationService,
    public httpClient: HttpClient
  ) { }



  ngOnInit(): void {
    this.dataLoading = true;
    this.reservationService.fetchReservationData()
      .subscribe({
        next: (data) => {
          this.availableTimes = data.available;
          this.reservedTimes = data.reservations;
          this.dataLoading = false;
        },
        error: (err) => {
          console.error("Error occurred: " + err);
        }
      });
  }

  onFormSubmit(ngForm: NgForm) {
    this.saveUnsuccessful = false;

    if (!ngForm.valid) {
      this.saveUnsuccessful = true;
      return;
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
    };
    
    let modifiedAvailableItem = JSON.parse(JSON.stringify(this.selectedReservation));
    let newNum = modifiedAvailableItem.number - ngForm.value.partyNumber;
    modifiedAvailableItem.number = newNum;

    let reservedItem = JSON.parse(JSON.stringify(this.selectedReservation));
    reservedItem.name = ngForm.value.personName;
    reservedItem.number = ngForm.value.partyNumber;


    this.httpClient.put<any>("http://localhost:8080/reservation", JSON.stringify(modifiedAvailableItem), options)
        .subscribe({
          next: () => {
            console.log("Call successful");
          },
          error: (err) => {
            console.error("Error occurred: " + err);
          }
        });

      this.httpClient.post<any>("http://localhost:8080/reservation", JSON.stringify(reservedItem), options)
      .subscribe({
          next: () => {
            console.log("Call successful");
          },
          error: (err) => {
            console.error("Error occurred: " + err);
          }
        });

      if (modifiedAvailableItem.number <= 0) 
      {
        const deleteOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
          body: JSON.stringify(modifiedAvailableItem)
        };
        this.httpClient.delete<any>("http://localhost:8080/reservation", deleteOptions)
        .subscribe({
            next: () => {
              console.log("Call successful");
            },
            error: (err) => {
              console.error("Error occurred: " + err);
            }
          });
      }


    ngForm.resetForm();
    this.selectedReservation = {id: 0, name: "", time: "", number: 0};

    this.reservationService.fetchReservationData()
      .subscribe({
        next: (data) => {
          this.availableTimes = data.available;
          this.reservedTimes = data.reservations;
          this.dataLoading = false;
        },
        error: (err) => {
          console.error("Error occurred: " + err);
        }
      });

  }

  public hoveredItem: any;

  public highlightRow(item: IReservationItem) {
    this.hoveredItem = item.id
  }

  public clickRow(item: IReservationItem) {
    this.selectedReservation = item;
    this.partyArray = Array.from(Array(item.number),(x,i)=>i+1);
  }

}