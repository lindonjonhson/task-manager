import { List } from './../../models/list.model';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.sass']
})
export class NewListComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit() {
  }

  createNewList(title: string) {
    this.taskService.createList(title).subscribe((list: List) => {
      // console.log(list);
      // Go back to lists/:id
      this.router.navigate([`/lists`, list.id]);
    });
  }

}
