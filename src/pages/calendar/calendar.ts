import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, Platform } from 'ionic-angular';
import * as moment from 'moment';
import { Settings } from '../../providers/providers';

import {
  CalendarSession,
  CALENDAR_SESSION_STATE_MISSED
} from '../../models/calendar-session';
import { CalendarSessions } from '../../providers/providers';

import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  currentCalendarSessions: CalendarSession[];
  is_started_by_user: boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'en-US'
  };

  todaySession: CalendarSession;
  nextSession: CalendarSession;

  constructor(public navCtrl: NavController, public calendarSessions: CalendarSessions,
    public settings: Settings, public menu: MenuController, public translate: TranslateService, public platform: Platform) {

    if (this.translate.getBrowserLang() == "es") {
      this.calendar.locale = "es-ES";
    }
    this.fetchCalendarSessions();
    this.settings.getValue('is_started_by_user').then(val => {
      this.is_started_by_user = val;
    });
  }

  private fetchCalendarSessions(): void {
    this.calendarSessions.query().subscribe((resp) => {
      let events = this.eventSource;
      for (let item of resp['calendarsessions']) {
        item = new CalendarSession(item);
        let state = item.notification.state ? item.notification.state : CALENDAR_SESSION_STATE_MISSED;

        let eventData = ({
          title: "Kayros",
          allDay: false,
          startTime: new Date(item.day), //new Date(Date.UTC(2018, 3, 8)),
          endTime: new Date(item.day),   //new Date(Date.UTC(2018, 3, 8)),     
          manual: item.manual,
          reprogram: item.reprogram,
          state: state
        });

        if (this.isTodayCalendarSession(item)) {
          this.todaySession = item;
        }
        if (this.isNextCalendarSession(item)) {
          this.nextSession = item;
        }
        events.push(eventData);
      }
      this.eventSource = [];
      setTimeout(() => {
        this.eventSource = events;
      });
    }, (err) => {
    });
  }

  public goSetup() {
    this.navCtrl.push('SetupPage');
  }
  private isTodayCalendarSession(item: CalendarSession) {
    let today = new Date();
    let ret = false;
    if (moment(item.day).isSame(today, 'day') && !item.isDone()) {
      ret = true;
    }
    return ret;
  }

  private isNextCalendarSession(item: CalendarSession) {
    let today = new Date();
    let ret = false;
    if (!this.nextSession) {
      if (moment(today).isBefore(item.day, 'day') && !item.isDone()) {
        ret = true;
      }
    } else {
      if (moment(item.day).isBetween(today, this.nextSession.day, 'day') && !item.isDone()) {
        ret = true;
      }
    }
    return ret;
  }

  addSession() {
    this.navCtrl.push('AddSessionPage');
  }

  doSession(calendarSession: CalendarSession) {
    this.navCtrl.push('DoSessionPage', {
      calendarSession: calendarSession
    });
  }

  rescheduleSession(calendarSession: CalendarSession) {
    this.navCtrl.push('RescheduleSessionPage', {
      calendarSession: calendarSession
    });
  }
  calendarSessionView(calendarSession: CalendarSession) {
    this.navCtrl.push('CalendarSessionViewPage', {
      calendarSession: calendarSession
    });
  }


  onViewTitleChanged(title) {
    this.viewTitle = title;
  }


  /******** Codi comentat per si es vol implementar aquestes fucionalitats en un futur *********/

  onEventSelected(event) {
    /*let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    
    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();*/
  }

  onTimeSelected(ev) {
    //this.selectedDay = ev.selectedTime;
  }

  markDisabled = (date: Date) => {
    /*var current = new Date();
    return date < current || date > current;*/
    return false;
  };
  /*
  addEvent() {
    let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;
 
        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);
 
        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }*/

}