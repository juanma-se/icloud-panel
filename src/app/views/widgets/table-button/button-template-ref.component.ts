import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

import { IButtonComponentEventType } from '@app/interfaces/button-template-ref-event-type';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-button-template-ref',
  templateUrl: './button-template-ref.component.html',
  styleUrl: './button-template-ref.component.scss',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
  ]
})
export class ButtonTemplateRefComponent implements OnInit {

  constructor() { }

  @Output()
  emitter = new EventEmitter<IButtonComponentEventType>();

  @Input()
  data: any = {};

  @Input()
  editActionText = 'Editar';

  @Input()
  deleteActionText = 'Borrar';

  @Input()
  actions: { label: string, action: string, cssClass?: string }[] = [];

  ngOnInit(): void {
  }

  onAction(action: string) {
    this.emitter.next({
      cmd: action,
      data: this.data,
      action: action
    });
  }

}