import { TaskService } from './../../services/task.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Task } from './../../models/task.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.sass']
})
export class EditTaskComponent implements OnInit {

  oldname: string;
  taskId: string;
  listId: string;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskId = params.taskId;
        this.listId = params.listId;
      });

    this.taskService.getTask(this.listId, this.taskId).subscribe((task: Task) => {
      this.oldname = task.title;
    });
  }

  updateTask(title: string) {
    this.taskService.updateTask(this.listId, this.taskId, title).subscribe(() => {
      this.router.navigate(['/lists', this.listId]);
    });
    // this.taskService.
    return false;
  }

}
