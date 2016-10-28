import { Component, Input } from '@angular/core';


@Component({
  selector: 're-editor-toolbar',
  templateUrl: './editor-toolbar.component.html'
})

export class EditorToolbarComponent {
  @Input() record: Object;

  constructor() {

  }
}
