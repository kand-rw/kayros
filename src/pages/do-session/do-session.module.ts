import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { DoSessionPage } from './do-session';
import { CalendarSessions } from '../../providers/providers';

@NgModule({
  declarations: [
    DoSessionPage,
  ],
  imports: [
    IonicPageModule.forChild(DoSessionPage),
    TranslateModule.forChild()
  ],
  exports: [
    DoSessionPage
  ],
  providers: [CalendarSessions],
})
export class DoSessionPageModule { }
