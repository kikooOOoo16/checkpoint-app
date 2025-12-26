import {Body, Controller, Get, Post, Redirect, Render, Session} from 'routing-controllers';
import {detailService} from '../service';
import {Visitor} from '../database/model/entity/visitor';
import {logger, LogNamespace} from '../logger';

@Controller()
export class VisitorController {
  @Get('/registration')
  @Render('registration')
  getRegistration() {
    return {title: 'Visitor Registration'};
  }

  @Post('/registration')
  @Redirect('/dashboard')
  async registerVisitor(@Body() visitor: Visitor) {
    logger(LogNamespace.DEFAULT).info('Registering visitor', {visitor});
    await detailService.registerVisitor({...visitor, entryTime: new Date()});
    return {message: 'Success'};
  }

  @Get('/login')
  @Render('login')
  getLogin() {
    return {title: 'Worker Login'};
  }

  @Post('/login')
  async loginWorker(@Body() body: any, @Session() session: any) {
    const {username} = body;
    logger(LogNamespace.DEFAULT).info('Worker login attempt', {username});
    const worker = await detailService.loginWorker(username);
    if (worker) {
      session.user = worker;
      return {redirect: '/dashboard'};
    }
    return {error: 'Invalid username'};
  }

  @Get('/dashboard')
  @Render('dashboard')
  getDashboard(@Session() session: any) {
    return {
      user: session.user,
      title: 'Dashboard',
      successMessage: session.user ? 'You successfully logged in' : 'Visitor registered'
    };
  }

  @Get('/logout')
  @Redirect('/login')
  logout(@Session() session: any) {
    session.user = null;
    return {};
  }
}
