import {
    Component,
    Input
} from '@angular/core';
import { RecordService } from '../../shared/services';

@Component({
  selector: 're-editor-toolbar-save',
  templateUrl: './editor-toolbar-save.component.html',
  styleUrls: [
    './editor-toolbar-save.component.scss'
  ]
})

export class EditorToolbarSaveComponent {
  @Input() record: Object;
  private errorMap: Object;

  constructor(private recordService: RecordService) {

  }

  onClickSave(event: Object) {
    this.recordService.saveRecord(this.record)
    .subscribe(resp => this.errorMap = resp['errorMap']);
  }
}
