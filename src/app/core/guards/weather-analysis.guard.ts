import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NavigationStateService } from '../services/navigation-state.service';

export const weatherAnalysisGuard: CanActivateFn = (route) => {
  const navigationState = inject(NavigationStateService);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));

  if (
    Number.isInteger(id) &&
    id > 0 &&
    navigationState.canAccessWeatherAnalysis(id)
  ) {
    return true;
  }

  return router.createUrlTree(['/']);
};