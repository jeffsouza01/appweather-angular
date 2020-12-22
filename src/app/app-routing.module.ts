import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/containers/home/home.page';
import { Bookmark } from './shared/models/bookmark.model';
const routes: Routes = [
  {
    path: '', component: HomePage
  },
  {
    path: 'bookmarks', component: Bookmark
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
