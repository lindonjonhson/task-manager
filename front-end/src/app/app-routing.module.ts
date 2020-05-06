import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  // Here we put the paths and where they gonna lead
  // By putting 'blank', and TaskViewComponent, that means that the main page will lead to task view
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'signup', component: SignupPageComponent },
  { path: 'new-list', component: NewListComponent },
  { path: 'edit-list/:id', component: EditListComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'lists', component: TaskViewComponent },
  { path: 'lists/:id', component: TaskViewComponent },
  { path: 'lists/:id/new-task', component: NewTaskComponent },
  { path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
