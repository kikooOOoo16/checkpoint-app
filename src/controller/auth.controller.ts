import {Body, Controller, Get, Post, Redirect, Render, Res, Session, UseBefore} from 'routing-controllers';
import {detailService} from '../service';
import {logger, LogNamespace} from '../logger';
import {validateBody} from '../middleware/validator';
import {redirectIfLoggedIn} from '../middleware';
import {Response} from 'express';
import {AccountRole} from '../model/enums/account-roles.enum';

@Controller()
export class AuthController {
  @Get('/login')
  @UseBefore(redirectIfLoggedIn)
  @Render('login')
  getLogin(@Session() session: any) {
    const error = session.error;
    session.error = null;
    return {title: 'Worker Login', error};
  }

  @Post('/login')
  @UseBefore(redirectIfLoggedIn)
  @UseBefore(validateBody('LoginSchema'))
  async loginWorker(@Body() body: any, @Session() session: any) {
    const {email, password} = body;
    logger(LogNamespace.AUTH_CONTROLLER_NAMESPACE).info('Worker login attempt', {email});
    const worker = await detailService.loginWorker(email, password);
    if (worker) {
      logger(LogNamespace.AUTH_CONTROLLER_NAMESPACE).info('Worker login successful', {email});
      session.user = worker;
      return {redirect: '/dashboard'};
    }
    logger(LogNamespace.AUTH_CONTROLLER_NAMESPACE).warn('Worker login failed: Invalid email or password', {email});
    return {error: 'Invalid email or password'};
  }

  @Get('/logout')
  @Redirect('/login')
  async logout(@Session() session: any) {
    if (session.user && session.user.email) {
      await detailService.logoutWorker(session.user.email);
    }
    session.user = null;
    return {};
  }

  @Get('/admin/login')
  @UseBefore(redirectIfLoggedIn)
  @Render('admin_login')
  getAdminLogin(@Session() session: any) {
    const error = session.error;
    session.error = null;
    return {title: 'Admin Login', error};
  }

  @Post('/admin/login')
  @UseBefore(redirectIfLoggedIn)
  @UseBefore(validateBody('LoginSchema'))
  async loginAdmin(@Body() body: any, @Session() session: any, @Res() res: Response) {
    const {email, password} = body;
    logger(LogNamespace.AUTH_CONTROLLER_NAMESPACE).info('Admin login attempt', {email});

    const admin = await detailService.loginWorker(email, password);

    if (admin && admin.role === AccountRole.ADMIN) {
      logger(LogNamespace.AUTH_CONTROLLER_NAMESPACE).info('Admin login successful', {email});
      session.user = admin;
      res.redirect('/admin/dashboard');
      return res;
    }

    logger(LogNamespace.AUTH_CONTROLLER_NAMESPACE).warn('Admin login failed: Unauthorized or invalid credentials', {
      email
    });
    session.error = 'Invalid admin credentials';
    res.redirect('/admin/login');
    return res;
  }
}
