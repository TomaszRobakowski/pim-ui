import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceListComponent } from './components/price-list/price-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'price-list',
    pathMatch: 'full',
  },
  {
    path: 'price-list',
    component: PriceListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
