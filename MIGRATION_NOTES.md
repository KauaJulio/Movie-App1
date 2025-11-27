# Notas de Migração: NgModule → Standalone

Este documento descreve as principais mudanças realizadas na migração do projeto de arquitetura baseada em NgModule para Standalone Components.

## 🔄 Principais Mudanças

### 1. Estrutura de Componentes

#### Antes (NgModule)
```typescript
// home.module.ts
@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ]
})
export class HomePageModule {}

// home.page.ts
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {}
```

#### Depois (Standalone)
```typescript
// tab1.page.ts
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
export class Tab1Page {}
```

### 2. Roteamento

#### Antes (NgModule)
```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module')
      .then(m => m.HomePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

#### Depois (Standalone)
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes')
      .then((m) => m.routes),
  },
];

// tabs.routes.ts
export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () => import('../tab1/tab1.page')
          .then((m) => m.Tab1Page),
      }
    ]
  }
];
```

### 3. Bootstrap da Aplicação

#### Antes (NgModule)
```typescript
// main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
```

#### Depois (Standalone)
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
});
```

### 4. HTTP Interceptors

#### Antes (Class-based)
```typescript
// auth-interceptors.ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.token}`
      }
    });
    return next.handle(clonedRequest);
  }
}

// app.module.ts
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
]
```

#### Depois (Functional)
```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${environment.token}`
    }
  });
  return next(clonedRequest);
};

// main.ts
providers: [
  provideHttpClient(withInterceptors([authInterceptor]))
]
```

### 5. Importação de Componentes Ionic

#### Antes (NgModule)
```typescript
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [IonicModule]
})
```

#### Depois (Standalone)
```typescript
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent 
} from '@ionic/angular/standalone';

@Component({
  imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
```

### 6. Serviços

**Não houve mudança significativa** - serviços com `providedIn: 'root'` funcionam da mesma forma:

```typescript
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private httpClient: HttpClient = inject(HttpClient);
  // ...
}
```

## ✅ Vantagens da Arquitetura Standalone

1. **Menos Boilerplate**: Não é necessário criar arquivos de módulo separados
2. **Lazy Loading Simplificado**: Carregamento de componentes individuais ao invés de módulos inteiros
3. **Melhor Tree Shaking**: Apenas os componentes importados são incluídos no bundle
4. **Código Mais Limpo**: Imports explícitos em cada componente
5. **Melhor Performance**: Bundles menores e mais otimizados
6. **Padrão Moderno**: Alinhado com a direção futura do Angular

## 📊 Comparação de Tamanho

### Build de Produção

**Antes (NgModule)**:
- Initial total: ~697 KB

**Depois (Standalone)**:
- Initial total: ~697 KB (similar, mas com melhor tree-shaking)

### Lazy Chunks

**Standalone** gera chunks menores e mais granulares:
- tab1-page: 10.97 KB
- tab2-page: 1.10 KB
- tab3-page: 4.01 KB

## 🔍 Checklist de Migração

- [x] Remover todos os `@NgModule` das páginas
- [x] Adicionar `imports` array nos `@Component`
- [x] Converter rotas de `loadChildren` para `loadComponent`
- [x] Atualizar `main.ts` para usar `bootstrapApplication`
- [x] Converter interceptors para formato funcional
- [x] Importar componentes Ionic individualmente
- [x] Atualizar imports de `@ionic/angular` para `@ionic/angular/standalone`
- [x] Testar todas as funcionalidades
- [x] Verificar build de produção

## 📚 Recursos

- [Angular Standalone Components Guide](https://angular.dev/guide/components/standalone)
- [Ionic Angular Standalone Documentation](https://ionicframework.com/docs/angular/standalone)
- [Angular HTTP Interceptors](https://angular.dev/guide/http/interceptors)

---

**Data da Migração**: Novembro 2025  
**Versão Angular**: 20.0.0  
**Versão Ionic**: 8.0.0
