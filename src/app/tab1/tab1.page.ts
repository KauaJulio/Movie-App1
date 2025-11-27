import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonImg,
  LoadingController
} from '@ionic/angular/standalone';
import ColorThief from 'colorthief';
import { Movie } from '../models/movie.models';
import { MovieService } from '../services/movie.service';
import { UtilsHelper } from '../utils/utils.helper';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonImg
  ],
})
export class Tab1Page implements AfterViewInit, OnInit {
  backgroundColor: string = 'rgb(0, 0, 0)';
  
  movies?: Movie[];
  highlightMovie?: Movie;

  private startScrollPoint = 0;
  private initialColor = [0, 0, 0];

  darkModeEnable: boolean = true;

  @ViewChild('posterImage') posterImage!: ElementRef<HTMLImageElement>;

  private movieService: MovieService = inject(MovieService);
  private loadingController = inject(LoadingController);

  constructor() {}

  ngOnInit(): void {
    this.toggleDarkMode();
  }

  ngAfterViewInit(): void {
    this.getMovies();
  }

  onScroll(event: any): void {
    this.updateBackgroundColor(event.detail.scrollTop);
  }

  async getMovies(refresher?: any) {
    const loading = await this.loadingController.create();
    
    if (!refresher) {
      await loading.present();
    }

    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        console.log(data);
        this.movies = data;

        const randomIndex = Math.floor(Math.random() * this.movies!.length);
        this.highlightMovie = this.movies![randomIndex];
        this.initializeImage();
        
        this.completeLoading(loading, refresher);
      },
      error: (error) => {
        console.log(error);
        this.completeLoading(loading, refresher);
      }
    });
  }

  private initializeImage(): void {
    const img = this.posterImage.nativeElement;
    img.onload = () => {
      this.startScrollPoint = img.offsetHeight / 2;
      this.extractColors(img);
    }
    img.src = `https://image.tmdb.org/t/p/w500/${this.highlightMovie?.poster_path}?filme`;
  }
  
  private extractColors(img: HTMLImageElement) {
    const colorThief = new ColorThief();
    const rgbColors = colorThief.getColor(img);
    this.initialColor = rgbColors;
    this.backgroundColor = `rgb(${rgbColors.join(',')})`;
  }

  private updateBackgroundColor(scrollTop: number): void {
    if (scrollTop < this.startScrollPoint) {
      this.backgroundColor = `rgb(${this.initialColor.join(', ')})`;
      return;
    }

    const maxTransitionScroll = 300;
    const distanceScrolled = scrollTop - this.startScrollPoint;
    const progress = Math.min(distanceScrolled / maxTransitionScroll, 1);

    const finalColor = [0, 0, 0];
    const interpolateColor = UtilsHelper.interpolateColor(this.initialColor, finalColor, progress);
    this.backgroundColor = `rgb(${interpolateColor.join(', ')})`;
  }

  toggleDarkMode(): void {
    document.documentElement.classList.toggle('ion-palette-dark', this.darkModeEnable);
  }

  private completeLoading(loading?: HTMLIonLoadingElement, refresher?: any) {
    loading?.dismiss();
    refresher?.target.complete();
  }
}
