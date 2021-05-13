import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {config} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  userMenuItems: any[]  =  [
    {
      icon: 'face',
      title: 'Profile',
      url: 'profile'
    },
    {
      icon: 'dashboard',
      title: 'Board',
      url: '/'
    }, {
      icon: 'logout',
      title: 'Logout',
      url: 'logout'
    }
  ];
  tvtBoard = {
    todo: [
        'todo 1',
      'todo 2',
      'todo 3',
    ],
    inProgress: [

    ],
    review: [
      'review 1',
      'review 2',
      'review 3',
    ],
    complete: [
      'complete 1',
      'complete 2',
      'complete 3',
    ]
  };

  autoSaveTimer = 0;
  autoSaveTimeout = null;
  autoSaveInterval = null;

  constructor(private snackbar: MatSnackBar) {
    this.importData();
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
    this.autoSaveData();
  }

  autoSaveData(): void {
    if (this.autoSaveInterval){
      clearInterval(this.autoSaveInterval);
      this.autoSaveTimer = 0;
    }

    this.autoSaveInterval = setInterval(() => {
        ++this.autoSaveTimer;

        if (this.autoSaveTimer >= 100) {
        this.autoSaveTimer = 0;
        clearInterval(this.autoSaveInterval);
      }
    }, 50);

    if (this.autoSaveTimeout) { clearTimeout((this.autoSaveTimeout)); }
    this.autoSaveTimeout = setTimeout(() => {
      this.saveData();
    }, 5000);
  }

  saveData(): void {
    const data = JSON.stringify(this.tvtBoard);
    localStorage.setItem('tvtBoard', data);
    this.snackbar.open('Saved !!!', 'Done',  {duration: 3000});
  }
  importData(): void {
    const hasDataInLocalStorage = localStorage.getItem('tvtBoard');
    if (!hasDataInLocalStorage){
     return;
    }
    this.tvtBoard = JSON.parse(hasDataInLocalStorage);
  }

}
