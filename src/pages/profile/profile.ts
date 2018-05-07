import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Settings } from '../../providers/providers';
import { LoadingController } from 'ionic-angular';
import { User } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  private RestartProgramErrorString: string;
  private RestartProgramSuccessString: string;
  is_started_by_user: boolean;
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public settings: Settings,
    public user: User,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController) {


    this.translateService.get(['RESTART_PROGRAM_ERROR', 'RESTART_PROGRAM_SUCCESS']).subscribe((value) => {
      this.RestartProgramErrorString = value.RESTART_PROGRAM_ERROR,
        this.RestartProgramSuccessString = value.RESTART_PROGRAM_SUCCESS
    })
    this.settings.getValue('is_started_by_user').then(val => {
      this.is_started_by_user = val;
    });
  }
  loader = this.loadingCtrl.create({
    content: "",
  });
  public restartProgram() {
    this.loader.present();
    this.user.restartProgram().subscribe((resp) => {
      this.loader.dismiss();
      this.navCtrl.setRoot('CalendarPage');
      let toast = this.toastCtrl.create({
        message: this.RestartProgramSuccessString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }, (err) => {
      this.loader.dismiss();
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.RestartProgramErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  public goHistory() {
    this.navCtrl.push('HistoryPage');
  }

  public goInstructionsProfile() {
    this.navCtrl.push('InstructionsProfilePage');
  }

  public goTimeReminder() {
    this.navCtrl.push('TimeReminderPage');
  }

  public goChangePassword() {
    this.navCtrl.push('ChangePasswordPage');
  }

}
