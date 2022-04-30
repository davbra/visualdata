import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {

  @Input() pageTitle :string;
  @Input() smallTitle :string;
  @Input() iconUrl :string;

  constructor() { }

  ngOnInit(): void {
  }

}
