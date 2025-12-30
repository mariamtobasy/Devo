import { Component, OnInit } from '@angular/core';
import {
  CalendarView,
  CalendarEvent,
  CalendarMonthViewComponent,
  CalendarWeekViewComponent,
  CalendarDayViewComponent,
  CalendarPreviousViewDirective,
  CalendarTodayDirective,
  CalendarNextViewDirective,
  CalendarDatePipe
} from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/authService';
import { DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

interface MeetingEvent extends CalendarEvent {
  status?: 'Booked' | 'Free' | 'Pending';
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarMonthViewComponent,
    CalendarWeekViewComponent,
    CalendarDayViewComponent,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarNextViewDirective,
    CalendarDatePipe
  ],
  providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
})
export class Calendar implements OnInit {

  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();

  events: MeetingEvent[] = [];
newEvent = {
  title: '',
  start: '',
  end: '',
  notes: '',
  videoCallLink: ''
};


  refresh: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  // -------------------------
  // LOAD EVENTS (FIXED)
  // -------------------------
  loadEvents(): void {
    this.authService.getEvents().subscribe({
      next: (data: any) => {
        const eventsArray = data?.$values ?? [];

        this.events = eventsArray.map((ev: any) => ({
          id: Number(ev.id),
          title: ev.title,
          start: new Date(ev.start),
          end: ev.end ? new Date(ev.end) : undefined,
          status: 'Booked',
          meta: {
            notes: ev.notes,
            videoLink: ev.videoCallLink
          }
        }));

        this.refresh.next();
      },
      error: err => console.error('Error loading events', err)
    });
  }

  // -------------------------
  // VIEW CONTROLS
  // -------------------------
  setView(view: CalendarView): void {
    this.view = view;
  }

  // -------------------------
  // ADD EVENT
  // -------------------------
  addEvent(): void {
  if (!this.newEvent.title || !this.newEvent.start || !this.newEvent.end) {
    alert('Please fill title, start, and end date.');
    return;
  }

  // Capture the title now before we clear the form
  const eventTitle = this.newEvent.title;

  const payload = {
    title: this.newEvent.title,
    start: new Date(this.newEvent.start),
    end: new Date(this.newEvent.end),
    notes: this.newEvent.notes,
    videoCallLink: this.newEvent.videoCallLink
  };

  this.authService.addEvent(payload).subscribe({
    next: savedEvent => {
      this.events = [
        ...this.events,
        {
          id: Number(savedEvent.id),
          title: savedEvent.title,
          start: new Date(savedEvent.start),
          end: savedEvent.end ? new Date(savedEvent.end) : undefined,
          status: 'Booked',
          meta: {
            notes: savedEvent.notes,
            videoLink: savedEvent.videoCallLink
          }
        }
      ];

      // SUCCESS: Trigger the notification here
      this.authService.addNotification('📅', `New meeting scheduled: ${eventTitle}`);

      // Clear the form
      this.newEvent = { title: '', start: '', end: '', notes: '', videoCallLink: '' };
      this.refresh.next();
    },
    error: err => {
      console.error('Error adding event', err);
      this.authService.addNotification('❌', `Failed to save meeting: ${eventTitle}`);
    }
  });
}
  // -------------------------
  // EVENT INTERACTIONS
  // -------------------------
  handleEventClick(event: CalendarEvent): void {
    this.showNotes(event);
  }

  showNotes(event: CalendarEvent): void {
    const notes = event.meta?.notes;
    alert(notes ? notes : 'No notes');
  }

  openVideoLink(event: CalendarEvent): void {
    const link = event.meta?.videoLink;
    if (link) {
      window.open(link, '_blank');
    }
  }

  // -------------------------
  // DELETE EVENT
  // -------------------------
  deleteEvent(id?: number): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this event?')) {
      this.authService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== id);
          this.refresh.next();
        },
        error: err => console.error('Error deleting event', err)
      });
    }
  }
}