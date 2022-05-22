import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  disabled_1 = false;
  disabled_2 = false;

  constructor() { }

  ngOnInit(): void {
  }

}
