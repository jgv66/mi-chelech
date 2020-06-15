import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'tabvitrina',  loadChildren: () => import('../tabvitrina/tabvitrina.module').then( m => m.TabvitrinaPageModule)      },
      { path: 'tabofertas',  loadChildren: () => import('../tabofertas/tabofertas.module').then( m => m.TabofertasPageModule)      },
      { path: 'tabcateg',    loadChildren: () => import('../tabcateg/tabcateg.module')    .then( m => m.TabcategPageModule)        },
      { path: 'tabbuscar',   loadChildren: () => import('../tabbuscar/tabbuscar.module')  .then( m => m.TabbuscarPageModule)       },
      { path: 'tabmibolsa',  loadChildren: () => import('../tabmibolsa/tabmibolsa.module').then( m => m.TabmibolsaPageModule)      },
      { path: 'tabmicuenta', loadChildren: () => import('../tabmicuenta/tabmicuenta.module').then( m => m.TabmicuentaPageModule)   },
      {
        path: '',
        redirectTo: '/tabs/tabvitrina',
        pathMatch: 'full'
      },
      { path: 'login',        loadChildren: () => import('../login/login.module')            .then( m => m.LoginPageModule)         },
      { path: 'loginforgot',  loadChildren: () => import('../loginforgot/loginforgot.module').then( m => m.LoginforgotPageModule)   },
      { path: 'logincrear',   loadChildren: () => import('../logincrear/logincrear.module')  .then( m => m.LogincrearPageModule)    },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabvitrina',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
