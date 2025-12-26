import {Body, Controller, Get, Post, Redirect, Render, Res, Session, UseBefore} from 'routing-controllers';
import {authService, detailService} from '../service';
import {logger, LogNamespace} from '../logger';
import {validateBody} from '../middleware/validator';
import {Response} from 'express';
import {AccountRole} from '../model/enums/account-roles.enum';
import {redirectIfLoggedIn} from '../middleware';

@Controller('/admin')
export class AdminController {
  @Get('/login')
  @UseBefore(redirectIfLoggedIn)
  @Render('admin_login')
  getLogin(@Session() session: any) {
    const error = session.error;
    session.error = null;
    return {title: 'Admin Login', error};
  }

  @Post('/login')
  @UseBefore(redirectIfLoggedIn)
  @UseBefore(validateBody('LoginSchema'))
  async loginAdmin(@Body() body: any, @Session() session: any, @Res() res: Response) {
    const {email, password} = body;
    logger(LogNamespace.ADMIN_CONTROLLER_NAMESPACE).info('Admin login attempt', {email});

    const admin = await detailService.loginWorker(email, password);

    if (admin && admin.role === AccountRole.ADMIN) {
      logger(LogNamespace.ADMIN_CONTROLLER_NAMESPACE).info('Admin login successful', {email});
      session.user = admin;
      return res.redirect('/admin/dashboard');
    }

    logger(LogNamespace.ADMIN_CONTROLLER_NAMESPACE).warn('Admin login failed: Unauthorized or invalid credentials', {
      email
    });
    session.error = 'Invalid admin credentials';
    return res.redirect('/admin/login');
  }

  @Get('/dashboard')
  getDashboard(@Session() session: any, @Res() res: Response) {
    if (!session.user || session.user.role !== AccountRole.ADMIN) {
      return res.redirect('/admin/login');
    }

    const successMessage = session.successMessage;
    const error = session.error;
    session.successMessage = null;
    session.error = null;

    return res.render('admin_dashboard', {
      user: session.user,
      title: 'Admin Dashboard',
      successMessage,
      error,
      AccountRole
    });
  }

  @Post('/workers')
  @UseBefore(validateBody('WorkerSignupSchema'))
  @Redirect('/admin/dashboard')
  async signupWorker(@Body() body: any, @Session() session: any) {
    if (!session.user || session.user.role !== AccountRole.ADMIN) {
      return '/admin/login';
    }

    const {email, password, role} = body;
    logger(LogNamespace.ADMIN_CONTROLLER_NAMESPACE).info('Creating new worker/admin', {email, role});

    try {
      const hashedPassword = await authService.hashPassword(password);
      await detailService.registerWorker({
        email,
        password: hashedPassword,
        role,
        lastLogin: null
      });
      logger(LogNamespace.ADMIN_CONTROLLER_NAMESPACE).info('Successfully created new account', {email, role});
      session.successMessage = `Successfully created ${role}: ${email}`;
    } catch (err: any) {
      logger(LogNamespace.ADMIN_CONTROLLER_NAMESPACE).error('Failed to create account', {
        email,
        role,
        error: err.message
      });
      session.error = `Failed to create worker: ${err.message}`;
    }

    return {};
  }
}
