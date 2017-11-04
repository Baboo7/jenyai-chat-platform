import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StudentChatComponent } from './components/student-chat/student-chat.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { TeacherChatComponent } from './components/teacher-chat/teacher-chat.component';
import { TextComponent } from './components/chat/messages/text/text.component';
import { TeacherLoginComponent } from './components/teacher-login/teacher-login.component';
import { TypingIndicatorComponent } from './components/chat/messages/typing-indicator/typing-indicator.component';
import { VideoComponent } from './components/chat/messages/video/video.component';

// Guards
import { StudentAuthGuard } from './guards/student-auth.guard';
import { TeacherAuthGuard } from './guards/teacher-auth.guard';

// Pipes
import { SafePipe } from './pipes/safe.pipe';

// Services
import { AuthenticationService } from './services/authentication.service';
import { RoomService } from './services/room.service';
import { TokenManagerService } from './services/token-manager.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatHeaderComponent,
    HeaderComponent,
    LandingPageComponent,
    StudentChatComponent,
    StudentLoginComponent,
    StudentsListComponent,
    TeacherChatComponent,
    TextComponent,
    TeacherLoginComponent,
    TypingIndicatorComponent,
    VideoComponent,

    SafePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        {
          path: 'student',
          component: StudentLoginComponent
        },
        {
          path: 'student/chat',
          component: StudentChatComponent,
          canActivate: [ StudentAuthGuard ]
        },
        {
          path: 'teacher',
          component: TeacherLoginComponent
        },
        {
          path: 'teacher/chat',
          component: TeacherChatComponent,
          canActivate: [ TeacherAuthGuard ]
        },
        {
          path: '',
          component: LandingPageComponent
        }
      ]
    )
  ],
  providers: [
    StudentAuthGuard,
    TeacherAuthGuard,

    AuthenticationService,
    RoomService,
    TokenManagerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
