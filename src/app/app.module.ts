import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { ChatComponent } from './Components/ChatComponent/chat.component';
import { HeaderComponent } from './Components/HeaderComponent/header.component';
import { LandingPageComponent } from './Components/LandingPageComponent/landing-page.component';
import { StudentChatComponent } from './Components/StudentChatComponent/student-chat.component';
import { StudentsListComponent } from './Components/StudentsListComponent/students-list.component';
import { TeacherChatComponent } from './Components/TeacherChatComponent/teacher-chat.component';
import { TextMessageComponent } from './Components/TextMessageComponent/text-message.component';

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
