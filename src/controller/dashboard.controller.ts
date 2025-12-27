import {Controller, Get, Render, Session} from 'routing-controllers';
import {logger, LogNamespace} from '../logger';

@Controller()
export class DashboardController {
  @Get('/dashboard')
  @Render('dashboard')
  getDashboard(@Session() session: any) {
    logger(LogNamespace.DASHBOARD_CONTROLLER_NAMESPACE).info('Rendering dashboard', {
      user: session.user ? session.user.email : 'Visitor'
    });
    const successMessage =
      session.successMessage || (session.user ? 'You successfully logged in' : 'Visitor registered');
    const error = session.error;
    session.successMessage = null;
    session.error = null;
    return {
      user: session.user,
      title: 'Dashboard',
      successMessage,
      error
    };
  }
}
