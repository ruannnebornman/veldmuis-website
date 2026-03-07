import { Component, signal } from '@angular/core';
import { siteContent } from './data/site-content';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal(siteContent.siteName);
  protected readonly content = siteContent;
  protected readonly currentYear = new Date().getFullYear();
}
