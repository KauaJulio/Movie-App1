import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { WatchlistService, WatchlistItem } from '../services/watchlist.service';
import { MovieDetailModalComponent } from '../components/movie-detail-modal/movie-detail-modal.component';
import { addIcons } from 'ionicons';
import { trash, heart } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class Tab2Page implements OnInit {
  watchlistItems: WatchlistItem[] = [];

  private watchlistService = inject(WatchlistService);
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ trash, heart });
  }

  ngOnInit(): void {
    this.watchlistService.watchlist$.subscribe((items) => {
      this.watchlistItems = items;
    });
  }

  async openMovieDetail(item: WatchlistItem): Promise<void> {
    const modal = await this.modalController.create({
      component: MovieDetailModalComponent,
      componentProps: {
        movieId: item.id,
        mediaType: item.type
      },
      cssClass: 'movie-detail-modal'
    });
    return await modal.present();
  }

  removeFromWatchlist(item: WatchlistItem, event: Event): void {
    event.stopPropagation();
    this.watchlistService.removeFromWatchlist(item.id, item.type);
  }

  clearWatchlist(): void {
    if (confirm('Tem certeza que deseja limpar toda a lista?')) {
      this.watchlistService.clearWatchlist();
    }
  }
}
