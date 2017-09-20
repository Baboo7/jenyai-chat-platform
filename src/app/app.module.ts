import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StudentChatComponent } from './components/student-chat/student-chat.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { TeacherChatComponent } from './components/teacher-chat/teacher-chat.component';
import { TextMessageComponent } from './components/text-message/text-message.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HeaderComponent,
    LandingPageComponent,
    StudentChatComponent,
    StudentsListComponent,
    TeacherChatComponent,
    TextMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      [
        {
          path: 'student',
          component: StudentChatComponent
        },
        {
          path: 'teacher',
          component: TeacherChatComponent
        },
        {
          path: '',
          component: LandingPageComponent
        }
      ]
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
