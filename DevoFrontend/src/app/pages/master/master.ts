import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule,NgForm} from '@angular/forms';
import { AuthService } from '../../services/authService';
import { RecentService } from '../../services/RecentService';

@Component({
  selector: 'app-master',
  templateUrl: './master.html',
  styleUrl: './master.css',
  imports:[CommonModule,RouterOutlet,FormsModule]
})
export class Master {

  // Track if sidebar is open or collapsed
sidebarOpen: boolean = true;

// Toggle the sidebar
toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

  
// NEW: Track which submenu is open
openSubmenu: string | null = null;

 
// NEW: Toggle submenu
toggleSubmenu(menu: string) {
  this.openSubmenu = this.openSubmenu === menu ? null : menu;
}


recentItems: string[] = [];


reminderMessage = '👀 Don’t forget to check your tasks today';

  // Placeholder data for last items
  lastStarred: string = 'No starred items yet';
  lastRecent: string = 'No recent items yet';


 contactOpen = false;
  submitted = false;
  backendMessage = '';

  constructor(private authService: AuthService, private recentService: RecentService) {
     // Subscribe to changes
    this.recentService.recentItems$.subscribe(items => this.recentItems = items);
  
  }

  openContact() {
    this.contactOpen = true;
  }

  closeContact() {
    this.contactOpen = false;
  }

  sendContact(form: NgForm) {
    if (form.invalid) return;

   /* this.authService.sendMessage(form.value).subscribe({
      next: (res: any) => {
        console.log('Contact response', res);
        this.backendMessage = res.message;   // 👈 backend message
        this.submitted = true;
        form.reset();
      },
      error: (err) => {
        console.error(err);
        this.backendMessage =
          err.error?.message || 'Something went wrong';
      }
    });*/
  }
  
}
