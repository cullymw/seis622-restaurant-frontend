import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { IReservationItem } from '../model/reservation-item'; 
import { ReservationService } from '../shared/reservation.service';
import { HttpHeaders } from '@angular/common/http';


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
  ) {
    // this.route.paramMap.subscribe({
    //   next: (params) => {
    //     this.viewTitle = params.get("view");
    //     this.assignMenuToDisplay();
    //   }
    // });
  }

  ngOnInit(): void {
    this.dataLoading = true;
    this.reservationService.fetchReservationData()
      .subscribe({
        next: (data) => {
          this.availableTimes = data.available;
          this.reservedTimes = data.reserved;
          this.dataLoading = false;
        },
        error: (err) => {
          console.error("Error occurred: " + err);
        }
      });
  }

  onSubmit(ngForm: NgForm) {
    this.saveUnsuccessful = false;

    if (!ngForm.valid) {
      this.saveUnsuccessful = true;
      return;
    }

    console.log(ngForm);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
    };



    ngForm.resetForm();

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