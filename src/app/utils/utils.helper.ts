export class UtilsHelper {
  static interpolateColor(color1: number[], color2: number[], progress: number): number[] {
    return color1.map((channel, index) => {
      return Math.round(channel + (color2[index] - channel) * progress);
    });
  }
}
