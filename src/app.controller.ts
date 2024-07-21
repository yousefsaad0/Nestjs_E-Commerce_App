import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render("index")
  root(){}

  @Get('/profile')
  @Render('profile')
  profile(){return}

  @Get("/signup")
  @Render("signup")
  signup(){return}

  @Get('/login')
  @Render('login')
  login(){}

}
