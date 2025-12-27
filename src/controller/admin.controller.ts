import {Body, Controller, Get, Post, Redirect, Res, Session, UseBefore} from 'routing-controllers';
import {authService, detailService} from '../service';
import {logger, LogNamespace} from '../logger';
import {validateBody} from '../middleware/validator';
import {Response} from 'express';
import {AccountRole} from '../model/enums/account-roles.enum';

@Controller('/admin')
export class AdminController {
  @Get('/dashboard')
  getDashboard(@Session() session: any, @Res() res: Response) {
    if (!session.user || session.user.role !== AccountRole.ADMIN) {
      res.redirect('/admin/login');
      return res;
    }

    const successMessage = session.successMessage;
    const error = session.error;
    session.successMessage = null;
    session.error = null;

    res.render('admin_dashboard', {
      user: session.user,
      title: 'Admin Dashboard',
      successMessage,
      error,
      AccountRole
    });
    return res;
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
