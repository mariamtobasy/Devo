import { Component } from '@angular/core';
import { MyList } from './my-list/my-list';
import { Tasks } from './tasks/tasks';
import { Notes } from './notes/notes';
import { Calendar } from './calendar/calendar';
import { TeamDashboard } from './team-dashboard/team-dashboard';
import { CommonModule } from '@angular/common';
import { MiniTimer } from './mini-timer';
import { TinyGame } from './tiny-game';
import { MotivationalQuote } from './motivational-quote';
import { Header } from "./header/header";
@Component({
  selector: 'app-dashboard',
  imports: [MiniTimer, MotivationalQuote, TinyGame, CommonModule, MyList, Tasks, Notes, Calendar, TeamDashboard, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone:true,
})
export class Dashboard {
  selectedTab: string = 'my-list'; // default tab
constructor() {
  console.log('Dashboard component CREATED');
}

selectTab(tab: string) {
  this.selectedTab = tab;
}
}
