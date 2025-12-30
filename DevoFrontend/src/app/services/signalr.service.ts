import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

export interface SignalRMessage {
  id?: number;
  senderUserId: number;
  senderName: string;
  text: string;
  teamId: number;
  sentAt: string;
}

export interface SignalRActivity {
  message: string;
  teamId: number;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class SignalRService {
  sendActivity(currentTeamId: number, arg1: string) {
    throw new Error('Method not implemented.');
  }
  private hubConnection?: signalR.HubConnection;
  private connectionPromise?: Promise<void>;

  private messagesSubject = new BehaviorSubject<SignalRMessage | null>(null);
  public messages$ = this.messagesSubject.asObservable();

  private activitiesSubject = new BehaviorSubject<SignalRActivity | null>(null);
  public activities$ = this.activitiesSubject.asObservable();

  public onTeamAdded$ = new BehaviorSubject<number | null>(null);
  
  // New Subject for deletions
  private messageDeletedSubject = new Subject<{teamId: number, messageId: number}>();
  public messageDeleted$ = this.messageDeletedSubject.asObservable();

  startConnection(token?: string): Promise<void> {
    if (this.connectionPromise) return this.connectionPromise;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5186/hubs/teams', { 
        accessTokenFactory: () => token || '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    // FIXED: The Controller sends ONE object (TeamMessage), not three strings
    this.hubConnection.on('ReceiveMessage', (msg: any) => {
      console.log('✅ SignalR Chat Received:', msg);
      this.messagesSubject.next({
        id: msg.id,
        senderUserId: msg.senderUserId,
        senderName: msg.senderName,
        text: msg.text,
        teamId: Number(msg.teamId),
        sentAt: msg.sentAt || new Date().toISOString()
      });
    });

    // Listener for deletions (so it disappears for everyone instantly)
    this.hubConnection.on('MessageDeleted', (messageId: number) => {
      console.log('🗑️ SignalR Message Deleted:', messageId);
      // We don't have the teamId here usually, so we pass 0 or handle it in the store
      this.messageDeletedSubject.next({ teamId: 0, messageId });
    });

    this.hubConnection.on('ReceiveActivity', (teamId: number, activity: string) => {
      this.activitiesSubject.next({ 
        message: activity, 
        teamId: Number(teamId), 
        createdAt: new Date() 
      });
    });

    this.hubConnection.on('AddedToTeam', (teamId: number) => {
      this.onTeamAdded$.next(teamId);
    });

    this.connectionPromise = this.hubConnection.start()
      .then(() => console.log('✅ SignalR Connected'))
      .catch(err => {
        console.error('❌ SignalR Error:', err);
        this.connectionPromise = undefined;
      });

    return this.connectionPromise;
  }

  async joinTeam(teamId: number) {
    await this.connectionPromise;
    this.hubConnection?.invoke('JoinTeam', teamId);
  }

  async leaveTeam(teamId: number) {
    await this.connectionPromise;
    this.hubConnection?.invoke('LeaveTeam', teamId);
  }

  async sendMessage(teamId: number, userName: string, message: string) {
    await this.connectionPromise;
    this.hubConnection?.invoke('SendMessageToTeam', teamId, userName, message);
  }
}