import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Public } from './global/decorator/public.decorator';

@Controller()
export class AppController {
  @Sse('sse')
  @Public()
  sse(): Observable<MessageEvent> {
    const arr = [
      'Apple',
      'Banana',
      'Orange',
      'Mango',
      'Pear',
      'Pineapple',
      'Strawberry',
    ];
    let index = 0;
    return new Observable<MessageEvent>((observer) => {
      const timer = setInterval(() => {
        if (index === arr.length) {
          clearInterval(timer);
          observer.next({ data: { text: 'Completed', completed: true } });
          observer.complete();
        } else {
          observer.next({ data: { text: arr[index++], completed: false } });
        }
      }, 1000);
      return () => clearInterval(timer);
    });
  }
}
