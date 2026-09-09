import { Component } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  template: `
    <div class="my-6 max-w-4xl mx-auto px-2 sm:px-4 flex justify-center">
      <iframe
        width="540"
        height="305"
        src="https://bbbac5ba.sibforms.com/v2/serve/MUIFALO8ArM-iOyUiX0K7E0wX1UzcY9DodrnIHBuQb0iaZiYbNd8rjgwyUb8iLwFZuSRANuzjLdJ9mY-fM5LPH5J_FyjTcFCwRGJXpCcGZGI-Wa2U3iNyXm16WUHsnlqAubnJFc17LkqKM2XAH9-Gj89mow6W8zbRV62ZAp6newfhbXKs4qHgjQZ73EnuISHqfAFtIa271Ol3DJjkw=="
        frameborder="0"
        scrolling="auto"
        allowfullscreen
        style="display: block; margin-left: auto; margin-right: auto; max-width: 100%; border: none;">
      </iframe>
    </div>
  `
})
export class NewsletterComponent {}
