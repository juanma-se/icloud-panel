import { Observable, forkJoin, map, of, takeUntil } from "rxjs";

import { DocumentService } from './../services/document.service';
import { ResolveFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from "@angular/core";

export const DashboardResolver: ResolveFn<Object> = (route, state) => {
  const documentService = inject(DocumentService);
  const userService = inject(UserService);

  return forkJoin({
    documents: documentService.getDocuments(),
    usuarios: userService.getUsers(),
  }).pipe(
    map(data => {
      return {
        documents: data.documents,
        usuarios: data.usuarios,
      };
    })
  );
};