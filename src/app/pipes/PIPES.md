# Pipes Personalizadas do Movie App

## RatingFormatPipe

Uma pipe personalizada que formata números de avaliação com estrela e escala /10.

### Uso

```html
{{ avaliacao | ratingFormat }}
```

### Parâmetros

- **value** (number): Valor da avaliação (0-10)

### Exemplos

```html
<!-- Formata avaliação 8.5 como "⭐ 8.5/10" -->
{{ movie.vote_average | ratingFormat }}

<!-- Resultado para 0 -->
{{ 0 | ratingFormat }}  <!-- ⭐ 0.0/10 -->

<!-- Resultado para 10 -->
{{ 10 | ratingFormat }} <!-- ⭐ 10.0/10 -->

<!-- Resultado para null/undefined -->
{{ null | ratingFormat }} <!-- N/D -->
```

### Implementação

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingFormat',
  standalone: true
})
export class RatingFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return 'N/A';
    return `⭐ ${value.toFixed(1)}/10`;
  }
}
```

### Testes

A pipe possui testes unitários em `rating-format.pipe.spec.ts` que cobrem:
- Formatação com estrela e /10
- Arredondamento para uma casa decimal
- Avaliação zero
- Avaliação perfeita (10)
- Valores nulos/indefinidos (retorna N/D)

### Uso no Projeto

Atualmente usada em:
- `home/home.page.html` - Seção de tendências (linha 72)

### Benefícios

- ✅ Reutilizável em todo o projeto
- ✅ Centraliza a lógica de formatação
- ✅ Mais limpo que usar `.toFixed(1)` manualmente
- ✅ Trata valores nulos/indefinidos
- ✅ Standalone (compatível com componentes standalone)
