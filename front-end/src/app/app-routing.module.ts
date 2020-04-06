import { NewTaskComponent } from './pages/new-task/new-task.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  // Here we put the paths and where they gonna lead
  // By putting 'blank', and TaskViewComponent, that means that the main page will lead to task view
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'new-list', component: NewListComponent },
  { path: 'lists', component: TaskViewComponent },
  { path: 'lists/:id', component: TaskViewComponent },
  { path: 'lists/:id/new-task', component: NewTaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
