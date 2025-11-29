import { RatingFormatPipe } from './rating-format.pipe';

describe('RatingFormatPipe', () => {
  let pipe: RatingFormatPipe;

  beforeEach(() => {
    pipe = new RatingFormatPipe();
  });

  it('deve criar uma instância', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve formatar avaliação com estrela e /10', () => {
    const result = pipe.transform(8.5);
    expect(result).toBe('⭐ 8.5/10');
  });

  it('deve arredondar para uma casa decimal', () => {
    const result = pipe.transform(7.456);
    expect(result).toBe('⭐ 7.5/10');
  });

  it('deve lidar com avaliação zero', () => {
    const result = pipe.transform(0);
    expect(result).toBe('⭐ 0.0/10');
  });

  it('deve lidar com avaliação perfeita', () => {
    const result = pipe.transform(10);
    expect(result).toBe('⭐ 10.0/10');
  });

  it('deve retornar N/D para null ou undefined', () => {
    expect(pipe.transform(null as any)).toBe('N/D');
    expect(pipe.transform(undefined as any)).toBe('N/D');
  });
});
