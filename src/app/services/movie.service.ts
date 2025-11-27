import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Movie, MovieResponse } from '../models/movie.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private httpClient: HttpClient = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    const url: string = `${environment.api}/3/movie/now_playing?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }
}
