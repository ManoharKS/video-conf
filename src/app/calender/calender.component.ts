import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class CalenderComponent implements OnInit {
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

  calendarEvents: EventInput[] = [{ title: 'Event Now', start: new Date() }];

  calendarOptions?: CalendarOptions;

  constructor() {}

  ngOnInit(): void {
    forwardRef(() => Calendar);

    this.calendarOptions = {
      plugins: this.calendarPlugins,
      editable: true,

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      weekends: true,
      dateClick: this.handleDateClick.bind(this),
    };
  }

  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    if (this.calendarOptions) {
      this.calendarOptions.weekends = !this.calendarOptions?.weekends;
    }
  }

  gotoPast() {
    let calendarApi = this.calendarComponent?.getApi();
    calendarApi?.gotoDate('2000-01-01'); // call a method on the Calendar object
  }

  handleDateClick(arg: any) {
    if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({
        // add new event data. must create new array
        title: 'New Event',
        start: arg.date,
        allDay: arg.allDay,
      });
    }
  }
}
