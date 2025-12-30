import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeamDto } from '../pages/dashboard/teams/teams.service';
import { MemberDto } from '../pages/dashboard/teams/member.service';
import { TaskDto } from '../pages/dashboard/teams/teamsTasks.service';
import { ChatMessageDto } from '../pages/dashboard/teams/chat.service';

@Injectable({
  providedIn: 'root'
})
export class TeamStoreService {
  // 1. Core State
  private _teams = new BehaviorSubject<TeamDto[]>([]);
  public teams$ = this._teams.asObservable();

  private activeTeamId: number | null = null;

  // 2. Data Maps for caching
  private membersMap: { [teamId: number]: MemberDto[] } = {};
  private tasksMap: { [teamId: number]: TaskDto[] } = {};
  private chatMap: { [teamId: number]: ChatMessageDto[] } = {};

  // 3. UI Observables (What the Dashboard listens to)
  private _currentMembers = new BehaviorSubject<MemberDto[]>([]);
  public currentMembers$ = this._currentMembers.asObservable();

  private _currentTasks = new BehaviorSubject<TaskDto[]>([]);
  public currentTasks$ = this._currentTasks.asObservable();

  private _currentChatMessages = new BehaviorSubject<ChatMessageDto[]>([]);
  public currentChatMessages$ = this._currentChatMessages.asObservable();

  // Helper to extract arrays from .NET $values structure
  private unwrap<T>(data: any): T[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values && Array.isArray(data.$values)) return data.$values;
    return [];
  }

  // --- Core Methods ---

  setTeams(data: any): void {
    const teamsArray = this.unwrap<any>(data);
    this._teams.next(teamsArray);

    // Properly map nested collections into the local maps
    teamsArray.forEach((team: any) => {
      if (team.id) {
        this.membersMap[team.id] = this.unwrap<MemberDto>(team.members);
        this.tasksMap[team.id] = this.unwrap<TaskDto>(team.tasks);
        // Match the backend property name "chatMessages" from your Postman response
        this.chatMap[team.id] = this.unwrap<ChatMessageDto>(team.chatMessages);
      }
    });

    if (this.activeTeamId) {
      this.refreshActiveTeamUI(this.activeTeamId);
    }
  }

  setActiveTeam(teamId: number) {
    this.activeTeamId = teamId;
    this.refreshActiveTeamUI(teamId);
  }

  private refreshActiveTeamUI(teamId: number) {
    this._currentMembers.next(this.getMembers(teamId));
    this._currentTasks.next(this.getTasks(teamId));
    this._currentChatMessages.next(this.getChat(teamId));
  }

  // --- Members ---

  addMember(teamId: number, member: MemberDto): void {
    const current = this.getMembers(teamId);
    this.membersMap[teamId] = [...current, member];
    this.syncTeamList(teamId); // Update the master list
    if (this.activeTeamId === teamId) {
      this._currentMembers.next(this.membersMap[teamId]);
    }
  }

  removeMember(teamId: number, userId: number) {
    if (this.membersMap[teamId]) {
      this.membersMap[teamId] = this.membersMap[teamId].filter(m => m.userId !== userId);
      this.syncTeamList(teamId);
      if (this.activeTeamId === teamId) {
        this._currentMembers.next(this.membersMap[teamId]);
      }
    }
  }

  getMembers(teamId: number): MemberDto[] {
    return this.membersMap[teamId] || [];
  }

  // --- Tasks ---

  addTask(teamId: number, task: TaskDto): void {
    const current = this.getTasks(teamId);
    this.tasksMap[teamId] = [...current, task];
    this.syncTeamList(teamId);
    if (this.activeTeamId === teamId) {
      this._currentTasks.next(this.tasksMap[teamId]);
    }
  }

  removeTask(teamId: number, taskId: number) {
    if (this.tasksMap[teamId]) {
      this.tasksMap[teamId] = this.tasksMap[teamId].filter(t => t.id !== taskId);
      this.syncTeamList(teamId);
      if (this.activeTeamId === teamId) {
        this._currentTasks.next(this.tasksMap[teamId]);
      }
    }
  }

  getTasks(teamId: number): TaskDto[] {
    return this.tasksMap[teamId] || [];
  }

  // --- Chat ---
addChat(teamId: number, data: any): void {
  // FIX: If data is a single message (not an array), wrap it so unwrap works
  const normalizedData = Array.isArray(data) || data?.$values ? data : [data];
  const incoming = this.unwrap<ChatMessageDto>(normalizedData);
  
  const currentChat = this.chatMap[teamId] || [];
  const updatedChat = [...currentChat];

  incoming.forEach(msg => {
    if (!msg) return;
    // Check by ID or fallback to content+time if ID is missing
    const exists = msg.id 
      ? updatedChat.some(m => m.id === msg.id) 
      : updatedChat.some(m => m.text === msg.text && m.sentAt === msg.sentAt);
      
    if (!exists) updatedChat.push(msg);
  });

  this.chatMap[teamId] = updatedChat;
  this.syncTeamList(teamId);

  if (this.activeTeamId === teamId) {
    this._currentChatMessages.next([...updatedChat]);
  }
}

  getChat(teamId: number): ChatMessageDto[] {
    return this.chatMap[teamId] ? [...this.chatMap[teamId]] : [];
  }

  removeChatMessage(teamId: number, messageId: number) {
    if (this.chatMap[teamId]) {
      this.chatMap[teamId] = this.chatMap[teamId].filter(m => m.id !== messageId);
      this.syncTeamList(teamId);
      if (this.activeTeamId === teamId) {
        this._currentChatMessages.next([...this.chatMap[teamId]]);
      }
    }
  }

  // --- Internal Sync Helper ---
  // This ensures the main teams$ list (sidebar) matches the maps
  private syncTeamList(teamId: number) {
    const teams = this._teams.value;
    const teamIndex = teams.findIndex(t => t.id === teamId);
    if (teamIndex !== -1) {
      // Update the underlying objects in the array
      teams[teamIndex].members = this.membersMap[teamId] as any;
      teams[teamIndex].tasks = this.tasksMap[teamId] as any;
      (teams[teamIndex] as any).chatMessages = this.chatMap[teamId] as any;
      this._teams.next([...teams]);
    }
  }

  // --- Teams CRUD ---

  addTeam(team: TeamDto): void {
    const current = this._teams.value;
    this.setTeams([...current, team]);
  }

  removeTeam(teamId: number): void {
    const currentTeams = this._teams.value.filter(t => t.id !== teamId);
    this._teams.next(currentTeams);
    delete this.membersMap[teamId];
    delete this.tasksMap[teamId];
    delete this.chatMap[teamId];
  }
}