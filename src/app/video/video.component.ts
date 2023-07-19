import { Component, OnInit } from '@angular/core';
import * as OT from '@opentok/client';
import { Subscriber } from 'rxjs';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  session: OT.Session | undefined;
  publisher: OT.Publisher | undefined;
  subscribers: OT.Subscriber[] = [];

  apiKey: string = '47748841';
  sessionId: string = '1_MX40Nzc0ODg0MX5-MTY4OTc3NTQ3MjU1MH5mNWVNOWtLRVg1b1VDdjZMRDJEWE9mSXV-fn4';
  token: string = 'T1==cGFydG5lcl9pZD00Nzc0ODg0MSZzaWc9NmYwZDU0NDg0MjAxOTkwZGFkODAyYTgxNTljN2JiOWVjNDkxODI2YTpzZXNzaW9uX2lkPTFfTVg0ME56YzBPRGcwTVg1LU1UWTRPVGMzTlRRM01qVTFNSDVtTldWTk9XdExSVmcxYjFWRGRqWk1SREpFV0U5bVNYVi1mbjQmY3JlYXRlX3RpbWU9MTY4OTc3NTQ5MSZub25jZT0wLjA0MjM4Nzc0NDE3MDg3MjY1NCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjkyMzY3NTE1JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
  // session: any;

  constructor() {
  }

  ngOnInit(): void {
    this.initializeSession();
  }

  // createSession(){
  //   OT.ses
  // }

  initializeSession() {
    this.session = OT.initSession(this.apiKey, this.sessionId);
    this.session.on('streamCreated', (event: any) => {
      this.handleStreamCreated(event);
    });
    this.session.on('streamDestroyed', (event: any) => {
      this.handleStreamDestroyed(event);
    });
    this.session.connect(this.token, (error: OT.OTError | undefined) => {
      if (error) {
        console.error('Error connecting to session:', error.message);

      } else {
        console.log('session connected');
        this.initializePublisher();
      }
    });
  }

  initializePublisher() {
    this.publisher = OT.initPublisher('publisherContainer', {
      insertMode: 'append',
    });

    this.session?.publish(this.publisher, (error: OT.OTError | undefined) => {
      if (error) {
        console.error('Error publishing stream:', error.message);
      } else {
        console.log('Stream published');
      }
    });
  }

  handleStreamCreated(event: any) {
    const subscriber = this.session?.subscribe(event.stream, `subscriberContainer-${event.stream.streamId}`, {
      insertMode: 'append',
    });
    if (subscriber) {
      console.log('Stream subscribed', subscriber.stream);
      this.subscribers.push(subscriber);
    }
  }


  handleStreamDestroyed(event: any) {
    const index = this.subscribers.findIndex((subscriber: any) => subscriber.stream?.streamId === event.stream.streamId);
    if (index !== -1) {
      const subscriber = this.subscribers.splice(index, 1)[0];
      console.log('Stream unsubscribed', subscriber.stream);
      this.session?.unsubscribe(subscriber);
    }
  }
}
