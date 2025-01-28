import { Injectable, Inject } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { IAuthGuardPermission } from '../interfaces/auth/auth-guard-permission';
import { AuthService } from '../../services/authentication/auth.service.service';
import { NavigationService } from '../../services/http/navigation.service';

// Получение ролей
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  state?: RouterStateSnapshot;

  constructor(
    public auth: AuthService,
    private router: Router,
    private nagivator: NavigationService,
    @Inject('LOCALSTORAGE') private localStorage: any
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let state = this.auth.isAuthenticated();
    if (!state) {
      this.router.navigate(['login']);
      return false;
    }
    if (route.data['permission']) {
      state = this.decodeRolesJst(route);
    }
    if (!state) {
      this.router.navigate(['']);
    }
    return state;
  }

  canShow(route: ActivatedRouteSnapshot): boolean {
    if (this.localStorage != null && this.localStorage.getItem('isAuth')) {
      return this.decodeRolesJst(route);
    }
    return false;
  }

  inRole(roleName: string) {
    const token = this.auth.getDecodedAccessToken();
    if (!token || (!token && !token.rol) || !roleName) {
      return false;
    }
    const listRoels = token.rol.split(',');
    const index = listRoels.findIndex((x: string) => x === roleName);
    return index > -1;
  }

  decodeRolesJst(route: ActivatedRouteSnapshot): boolean {
    const userRoles = this.auth.getDecodedAccessToken().rol;
    const listRoles = userRoles.split(',');
    const permissionData = route.data['permission'] as IAuthGuardPermission;
    if (!permissionData) {
      return true;
    }
    if (permissionData && permissionData.permittedRoles) {
      return this.hasAuthUserAccessToThisRoute(
        permissionData.permittedRoles,
        listRoles
      );
    }
    return false;
  }

  // check permissions user (if user have role from route data return true)
  hasAuthUserAccessToThisRoute(
    permissions: string[],
    roleList: string[]
  ): boolean {
    if (roleList && roleList.length > 0) {
      // tslint:disable-next-line:forin
      for (const roleName of roleList) {
        if (permissions.indexOf(roleName) > -1) {
          return true;
        }
      }
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.router.navigate(['login']);
    return false;
  }
}

export interface IJwtUser {
  sub: string;
  customer: string;
  stylist: string;
  admin: string;
}
