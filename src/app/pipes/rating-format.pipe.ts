import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingFormat',
  standalone: true
})
export class RatingFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return 'N/D';
    return `⭐ ${value.toFixed(1)}/10`;
  }
}
