import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonThumbnail,
  IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { rocketOutline, constructOutline, videocam, time } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonThumbnail,
    IonNote
  ],
})
export class Tab3Page implements OnInit {
  headerBackgroundColor: string = 'rgba(0, 0, 0, 0.7)';

  constructor() {
    addIcons({ rocketOutline, constructOutline, videocam, time });
  }

  ngOnInit() {}
}
