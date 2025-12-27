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
}
