import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-master',
  templateUrl: './master.html',
  styleUrl: './master.css',
  imports:[RouterOutlet,CommonModule]
})
export class Master {
  // Track which drawer is open ('recent' or 'starred')
  activeDrawer: string | null = null;

  // Placeholder data for last items
  lastStarred: string = 'No starred items yet';
  lastRecent: string = 'No recent items yet';

  // Toggle drawers
  toggleDrawer(drawer: string) {
    this.activeDrawer = this.activeDrawer === drawer ? null : drawer;
  }

  // Close drawer
  closeDrawer() {
    this.activeDrawer = null;
  }
}
