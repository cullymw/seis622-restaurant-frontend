import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from '../model/menu-item';
import { MenuService } from '../shared/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  public viewTitle: string | null = null;
  public displayMenu: MenuItem[] = [];
  public breakfastMenu: MenuItem[] = [];
  public lunchMenu: MenuItem[] = [];
  public dinnerMenu: MenuItem[] = [];
  public dataLoading: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public menuService: MenuService,
  ) {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.viewTitle = params.get("view");
        this.assignMenuToDisplay();
      }
    });
  }

  ngOnInit(): void {
    if (this.viewTitle) {
      this.dataLoading = true;
      this.menuService.fetchMenuData()
        .subscribe({
          next: (data) => {
            this.breakfastMenu = data.breakfast;
            this.lunchMenu = data.lunch;
            this.dinnerMenu = data.dinner;
            this.assignMenuToDisplay();
            this.dataLoading = false;
          },
          error: (err) => {
            console.error("Error occurred: " + err);
          }
        });
    }
  }

  assignMenuToDisplay() {
    switch (this.viewTitle) {
      case null:
        break;
      case 'breakfast':
        this.displayMenu = this.breakfastMenu;
        break;
      case 'lunch':
        this.displayMenu = this.lunchMenu;
        break;
      case 'dinner':
        this.displayMenu = this.dinnerMenu;
        break;
      default:
        console.error('No menu with that title.');
    }
  }
}
