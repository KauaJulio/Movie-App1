# HeroFlix - Movie App (Standalone)

Aplicativo Ionic com Angular em formato **standalone** para visualização de filmes em cartaz usando a API do TMDB (The Movie Database).

## 🚀 Características

- **Arquitetura Standalone**: Projeto totalmente recriado usando componentes standalone do Angular (sem módulos NgModule)
- **Integração com API TMDB**: Busca filmes em cartaz em tempo real
- **Extração de Cores**: Usa ColorThief para extrair cores dominantes dos posters
- **Efeito de Transição**: Background muda de cor suavemente ao fazer scroll
- **Pull-to-Refresh**: Atualização de conteúdo com gesto de arrastar para baixo
- **Dark Mode**: Tema escuro ativado por padrão
- **Navegação por Tabs**: Interface com 3 abas principais

## 📱 Estrutura do App

### Páginas

1. **Início (Tab1)**: 
   - Exibe poster destacado de um filme aleatório
   - Lista horizontal de filmes em cartaz
   - Efeito de transição de cor no background ao fazer scroll

2. **Jogos (Tab2)**:
   - Página placeholder para futura implementação

3. **Novidades (Tab3)**:
   - Últimas atualizações do app
   - Lista de lançamentos de filmes

## 🛠️ Tecnologias Utilizadas

- **Ionic Framework 8.0**: Framework para desenvolvimento mobile
- **Angular 20.0**: Framework JavaScript standalone
- **Capacitor 7.4**: Runtime nativo para apps mobile
- **ColorThief 2.6**: Biblioteca para extração de cores de imagens
- **RxJS 7.8**: Programação reativa
- **TypeScript 5.9**: Linguagem tipada

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test
```

## 🔧 Configuração

### API TMDB

O projeto usa a API do The Movie Database (TMDB). As credenciais estão configuradas em:

```
src/environments/environment.ts
src/environments/environment.prod.ts
```

### Interceptor de Autenticação

O projeto usa um interceptor funcional para adicionar automaticamente o token de autenticação em todas as requisições HTTP:

```typescript
src/app/interceptors/auth.interceptor.ts
```

## 📂 Estrutura de Arquivos

```
src/app/
├── interceptors/
│   └── auth.interceptor.ts       # Interceptor HTTP standalone
├── models/
│   └── movie.models.ts            # Interfaces TypeScript
├── services/
│   └── movie.service.ts           # Serviço de filmes
├── utils/
│   └── utils.helper.ts            # Funções auxiliares
├── types/
│   └── colorthief.d.ts            # Declaração de tipos
├── tab1/                          # Página Início (Home)
├── tab2/                          # Página Jogos
├── tab3/                          # Página Novidades
├── tabs/                          # Container de tabs
├── app.component.ts               # Componente raiz
├── app.routes.ts                  # Rotas principais
└── main.ts                        # Bootstrap da aplicação
```

## 🎨 Funcionalidades Implementadas

### Extração de Cores do Poster

```typescript
private extractColors(img: HTMLImageElement) {
  const colorThief = new ColorThief();
  const rgbColors = colorThief.getColor(img);
  this.initialColor = rgbColors;
  this.backgroundColor = `rgb(${rgbColors.join(',')})`;
}
```

### Transição Suave de Cor no Scroll

```typescript
private updateBackgroundColor(scrollTop: number): void {
  if (scrollTop < this.startScrollPoint) {
    this.backgroundColor = `rgb(${this.initialColor.join(', ')})`;
    return;
  }

  const maxTransitionScroll = 300;
  const distanceScrolled = scrollTop - this.startScrollPoint;
  const progress = Math.min(distanceScrolled / maxTransitionScroll, 1);

  const finalColor = [0, 0, 0];
  const interpolateColor = UtilsHelper.interpolateColor(
    this.initialColor, 
    finalColor, 
    progress
  );
  this.backgroundColor = `rgb(${interpolateColor.join(', ')})`;
}
```

## 🔄 Diferenças do Projeto Original

Este projeto foi completamente recriado em formato **standalone**, eliminando a necessidade de módulos NgModule:

### Antes (NgModule)
```typescript
@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, IonicModule, HomePageRoutingModule]
})
export class HomePageModule {}
```

### Depois (Standalone)
```typescript
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
  ]
})
export class Tab1Page { }
```

### Interceptor HTTP

**Antes**: Class-based interceptor com `HTTP_INTERCEPTORS`
```typescript
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) { }
}
```

**Depois**: Functional interceptor
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${environment.token}` }
  });
  return next(clonedRequest);
};
```

## 📱 Build para Produção

### Web
```bash
npm run build
```

### Android
```bash
ionic capacitor add android
ionic capacitor build android
```

### iOS
```bash
ionic capacitor add ios
ionic capacitor build ios
```

## 🧪 Testes

O projeto foi testado e validado:

✅ Compilação sem erros  
✅ Integração com API TMDB funcionando  
✅ Navegação entre tabs  
✅ Pull-to-refresh  
✅ Extração de cores dos posters  
✅ Efeito de transição de cor no scroll  
✅ Dark mode ativo  

## 📄 Licença

Este projeto é um exemplo educacional baseado no projeto original Mobile-App.

## 👨‍💻 Autor

Recriado em formato standalone por Manus AI

---

**Nota**: Este projeto usa a API do TMDB. Certifique-se de ter uma chave de API válida para uso em produção.
