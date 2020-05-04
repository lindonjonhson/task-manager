import { Task } from './../../models/task.model';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.sass']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }

   listId: string;

  ngOnInit() {
    // This method will retrieve the listId from the url
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params.id;
        console.log(this.listId);
      });
  }

  createTask( title: string) {
    this.taskService.createTask(title, this.listId).subscribe((newTask: Task) => {
      console.log(newTask);
      this.router.navigate([`../`, ], { relativeTo: this.route});
    });
  }

}
