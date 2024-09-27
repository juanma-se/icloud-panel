import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private navigationData: any = null;

  setNavigationData(data: any) {
    this.navigationData = data;
  }

  getNavigationData() {
    return this.navigationData;
  }
}
