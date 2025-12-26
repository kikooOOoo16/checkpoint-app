import {Body, Controller, Get, Post, Redirect, Render, Session, UseBefore} from 'routing-controllers';
import {detailService} from '../service';
import {Visitor} from '../database/model';
import {logger, LogNamespace} from '../logger';
import {validateBody} from '../middleware/validator';
import {redirectIfLoggedIn} from '../middleware';

@Controller()
export class VisitorController {
  @Get('/registration')
  @UseBefore(redirectIfLoggedIn)
  @Render('registration')
  getRegistration(@Session() session: any) {
    const error = session.error;
    session.error = null;
    return {title: 'Visitor Registration', error};
  }

  @Post('/registration')
  @UseBefore(redirectIfLoggedIn)
  @UseBefore(validateBody('VisitorRegistrationSchema'))
  @Redirect('/dashboard')
  async registerVisitor(@Body() visitor: Visitor) {
    logger(LogNamespace.VISITOR_CONTROLLER_NAMESPACE).info('Registering visitor', {email: visitor.email});
    await detailService.registerVisitor({...visitor, entryTime: new Date()});
    logger(LogNamespace.VISITOR_CONTROLLER_NAMESPACE).info('Visitor registered successfully', {email: visitor.email});
    return {message: 'Success'};
  }

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
    logger(LogNamespace.VISITOR_CONTROLLER_NAMESPACE).info('Worker login attempt', {email});
    const worker = await detailService.loginWorker(email, password);
    if (worker) {
      logger(LogNamespace.VISITOR_CONTROLLER_NAMESPACE).info('Worker login successful', {email});
      session.user = worker;
      return {redirect: '/dashboard'};
    }
    logger(LogNamespace.VISITOR_CONTROLLER_NAMESPACE).warn('Worker login failed: Invalid email or password', {email});
    return {error: 'Invalid email or password'};
  }

  @Get('/dashboard')
  @Render('dashboard')
  getDashboard(@Session() session: any) {
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

  @Get('/logout')
  @Redirect('/login')
  async logout(@Session() session: any) {
    if (session.user && session.user.email) {
      await detailService.logoutWorker(session.user.email);
    }
    session.user = null;
    return {};
  }
}
