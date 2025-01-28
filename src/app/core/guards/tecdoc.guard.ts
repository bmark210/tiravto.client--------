import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service.service';
import { MenuService } from '../../services/menu.service';

// Получение ролей
@Injectable()
export class TecDocGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    private router: Router,
    private menuService: MenuService,
    @Inject('LOCALSTORAGE') private localStorage: any) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let state = true;
    if (this.menuService.settingBool) {
      state = this.menuService.settingBool.tecDoc;
    }
    if (!state) {
      this.router.navigate(['']);
    }
    return state;
  }
}

