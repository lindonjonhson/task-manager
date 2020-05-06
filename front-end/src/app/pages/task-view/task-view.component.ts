import { List } from './../../models/list.model';
import { Task } from './../../models/task.model';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.sass']
})
export class TaskViewComponent implements OnInit {

  lists: List[];
  tasks: Task[];

  selectedListId: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // This method check if we have any listId in the parameters
    // So we can retrieve the tasks that belong to that listId
    this.route.params.subscribe(
      (params: Params) => {
        if(params.id) {
          // First we send the LIST parameters
          // console.log("These are the parameters");
          // console.log(params);
          this.selectedListId = params.id;
          this.taskService.getTasks(params.id).subscribe((tasks: Task[]) => {
              // Then we receive the TASKS of that list
              // console.log("These are the tasks");
              // console.log(tasks);
              this.tasks = tasks;
              /*
              tasks.forEach(task => {
                console.log(task._listId);
              });
              */
            });
        } else {
          this.tasks = undefined;
        }
      });

    // This method retrieve all the lists avaliable
    this.taskService.getLists().subscribe(
      (lists: List[]) => {
        this.lists = lists;
      });
  }

  onTaskClick(task: Task) {
    this.taskService.complete(task).subscribe(() => {
      console.log('Completed Successfully');
      task.completed = !task.completed;
    });
  }

  onDeleteListClick() {
    return this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
    });
  }

  onTaskDeleteClick(id: string) {
    return this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      /*
      console.log('Deleted Successfuly');
      this.router.navigate([`/lists`, this.selectedListId]);
      */
     this.tasks = this.tasks.filter(val => val._id !== id);
     console.log(res);
    });
  }

}
