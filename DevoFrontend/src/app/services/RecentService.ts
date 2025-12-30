// src/app/services/recent.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class RecentService {
  private _recentItems = new BehaviorSubject<string[]>([]);
  recentItems$ = this._recentItems.asObservable();

  add(item: string) {
    const current = this._recentItems.getValue();
    const newList = [item, ...current].slice(0, 5); // Keep last 5 items
    this._recentItems.next(newList);
  }

  
}
