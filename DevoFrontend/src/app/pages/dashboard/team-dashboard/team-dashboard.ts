import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsService, TeamDto ,CreateTeamDto } from '../teams/teams.service';
import { MembersService,MemberDto } from '../teams/member.service';
import { TasksService,CreateTaskDto,TaskDto } from '../teams/teamsTasks.service';
import { ChatService, ChatMessageDto } from '../teams/chat.service';
import { AuthService } from '../../../services/authService';
import { SignalRService } from '../../../services/signalr.service';
import { Subscription, filter } from 'rxjs';
import { TeamStoreService } from '../../../services/TeamStoreService';

@Component({
  selector: 'app-team-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-dashboard.html',
  styleUrls: ['./team-dashboard.css'],
})
export class TeamDashboard implements OnInit, OnDestroy {
  teams: TeamDto[] = [];
 selectedTeam?: TeamDto;

  // View data synced from Store
  members: MemberDto[] = [];
  tasks: TaskDto[] = [];
  chatMessages: ChatMessageDto[] = [];

  newTeamName = '';
  newTeamDescription = '';
  newTaskAssignedTo?: number;
  newTaskTitle = '';
  newChatText = '';
  newMemberUserId?: number;

  private subscriptions: Subscription[] = [];

  constructor(
    private teamsService: TeamsService,
    private membersService: MembersService,
    private tasksService: TasksService,
    private chatService: ChatService,
    private auth: AuthService,
    private signalR: SignalRService,
    private ngZone: NgZone,
    private teamStore: TeamStoreService
  ) {}

 
ngOnInit(): void {
  // 1. SYNC TEAMS LIST (Sidebar)
  this.subscriptions.push(
    this.teamStore.teams$.subscribe(teams => {
      this.teams = teams;
    })
  );

  // 2. INITIAL DATA LOAD
  this.teamsService.list().subscribe({
    next: (res) => this.teamStore.setTeams(res),
    error: (err) => console.error('Failed to load teams', err)
  });

  // 3. SIGNALR CONNECTION
  const token = this.auth.getToken();
  this.signalR.startConnection(token ?? undefined)
    .then(() => {
      if (this.selectedTeam?.id) this.signalR.joinTeam(this.selectedTeam.id);
    });

  // 4. THE ONLY SIGNALR LISTENER (Update the Store only)
  this.subscriptions.push(
    this.signalR.messages$.subscribe(msg => {
      if (msg) {
        // We only tell the store about the new message
        this.teamStore.addChat(msg.teamId, msg);
      }
    })
  );

  // 5. THE ONLY UI LISTENER (Listen to the Store only)
  this.subscriptions.push(
    this.teamStore.currentChatMessages$.subscribe(messages => {
      this.ngZone.run(() => {
        this.chatMessages = messages;
        this.scrollChatToBottom();
      });
    })
  );
  
  // 6. ACTIVITY FEED
  this.subscriptions.push(
    this.signalR.activities$.subscribe(activity => {
      if (activity) this.ngZone.run(() => console.log('System:', activity.message));
    })
  );

// Add this to your ngOnInit in team-dashboard.ts
this.subscriptions.push(
  this.signalR.onTeamAdded$.subscribe(teamId => {
    if (teamId) {
      // Re-fetch the full list from the server so the new team appears
      this.teamsService.list().subscribe(res => {
        this.teamStore.setTeams(res);
      });
    }
  })
);
// 7. Watch for Member changes automatically
  this.subscriptions.push(
    this.teamStore.currentMembers$.subscribe(members => {
      this.ngZone.run(() => this.members = members);
    })
  );

  // 8. Watch for Task changes automatically
  this.subscriptions.push(
    this.teamStore.currentTasks$.subscribe(tasks => {
      this.ngZone.run(() => this.tasks = tasks);
    })
  );

  this.subscriptions.push(
  this.signalR.messageDeleted$.subscribe(data => {
    if (data && this.selectedTeam) {
      // Remove it from the store, which will automatically update the UI
      this.teamStore.removeChatMessage(this.selectedTeam.id!, data.messageId);
    }
  })
);
}
selectTeam(team: TeamDto) {
  const teamId = team.id!;
  
  // 1. Tell the store which team is active
  this.teamStore.setActiveTeam(teamId); 
  this.selectedTeam = team;

  // 2. FIX: Explicitly sync local component arrays with the new team's data
  this.members = this.teamStore.getMembers(teamId);
  this.tasks = this.teamStore.getTasks(teamId);

  // 3. SignalR Room Management
  if (this.selectedTeam?.id) this.signalR.leaveTeam(this.selectedTeam.id);
  this.signalR.joinTeam(teamId);
}


addMember() {
  if (!this.selectedTeam || !this.newMemberUserId) return;
  const currentTeamId = this.selectedTeam.id!;

  this.membersService.add(currentTeamId, { userId: this.newMemberUserId, role: 'Member' }).subscribe({
    next: member => {
      this.teamStore.addMember(currentTeamId, member);
      
      // FIX: Only update the UI if we are still looking at the same team
      if (this.selectedTeam?.id === currentTeamId) {
        this.members = this.teamStore.getMembers(currentTeamId);
      }
      this.newMemberUserId = undefined;
    }
  });
}

createTask(): void {
  if (!this.selectedTeam || !this.newTaskTitle.trim()) return;
  const currentTeamId = this.selectedTeam.id!;

  const payload: CreateTaskDto = { 
    title: this.newTaskTitle, 
    teamId: currentTeamId, 
    assignedToUserId: this.newTaskAssignedTo,
    status: 'To Do', 
    priority: 'Normal', 
    pinned: false, 
    description: '' 
  };

  this.tasksService.create(currentTeamId, payload).subscribe({
    next: (task) => {
      this.ngZone.run(() => {
        this.teamStore.addTask(currentTeamId, task);
        
        // FIX: Only update the UI if we are still looking at the same team
        if (this.selectedTeam?.id === currentTeamId) {
          this.tasks = this.teamStore.getTasks(currentTeamId);
        }
        
        this.newTaskTitle = '';
        this.newTaskAssignedTo = undefined;
        this.signalR.sendActivity(currentTeamId, `Task created: ${task.title}`);
      });
    }
  });
}
 sendChat() {
  if (!this.selectedTeam || !this.newChatText.trim()) return;
  
  const user = this.auth.getCurrentUser();
  const teamId = this.selectedTeam.id!;
  const teamName = this.selectedTeam.name; // Capture name before clearing input

  const payload: ChatMessageDto = {
    teamId: teamId,
    senderUserId: user?.id || 0,
    senderName: user?.fullName || 'User',
    text: this.newChatText,
    sentAt: new Date().toISOString()
  };

  this.chatService.send(teamId, payload).subscribe({
    next: (res) => {
      this.ngZone.run(() => {
        // Trigger notification only after successful send
        this.auth.addNotification('💬', `Message sent to ${teamName}`);
        this.newChatText = '';
      });
    },
    error: (err) => {
      console.error('Check payload vs C# Model:', err);
      // Optional: notify the user that the send failed
      this.auth.addNotification('❌', `Failed to send message to ${teamName}`);
    }
  });
}
scrollChatToBottom(): void {
  setTimeout(() => {
    const container = document.getElementById('chatContainer');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, 100);
}


deleteTeam(teamId: number): void {
  if (confirm('Are you sure you want to delete this team?')) {
    this.teamsService.delete(teamId).subscribe({
      next: () => {
        this.ngZone.run(() => {
          // 1. Remove from the central Store
          this.teamStore.removeTeam(teamId);
          
          // 2. If the deleted team was the one we were looking at, clear selection
          if (this.selectedTeam?.id === teamId) {
            this.selectedTeam = undefined;
            this.members = [];
            this.tasks = [];
            this.chatMessages = [];
          }
        });
      },
      error: (err) => console.error('Delete failed', err)
    });
  }
}
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

deleteTask(taskId: number) {
  if (!this.selectedTeam) return;
  const teamId = this.selectedTeam.id!;

  this.tasksService.delete(teamId, taskId).subscribe({
    next: () => {
      this.teamStore.removeTask(teamId, taskId);
      // Refresh local view
      this.tasks = this.teamStore.getTasks(teamId);
    }
  });
}

createTeam(): void {
  if (!this.newTeamName.trim()) return;

  const payload = {
    Name: this.newTeamName.trim(),           // Capital N
    Description: this.newTeamDescription || '', // Capital D
    Members: [],                            // Capital M
    Tasks: [],                              // Capital T
    ChatMessages: []                        // Capital C
  };

  this.teamsService.create(payload as any).subscribe({
    next: (team) => {
      this.teamStore.addTeam(team);
      this.newTeamName = '';
      this.newTeamDescription = '';
    },
    error: (err) => {
      console.error("Server says:", err.error.errors);
    }
  });
}

deleteMessage(messageId: number) {
  if (!this.selectedTeam || !messageId) return;
  const teamId = this.selectedTeam.id!;

  // Optional: Add a confirmation dialog
  if (confirm('Delete this message?')) {
    this.chatService.delete(teamId, messageId).subscribe({
      next: () => {
        // This removes it from the local Store
        // The UI updates automatically because you are subscribed to currentChatMessages$
        this.teamStore.removeChatMessage(teamId, messageId);
      },
      error: (err) => console.error('Error deleting message:', err)
    });
  }
}

// Example for your Dashboard Component
removeMember(userId: number) {
  const teamId = this.selectedTeam!.id!;
  this.membersService.remove(teamId, userId).subscribe(() => {
    this.teamStore.removeMember(teamId, userId);
    // RE-ASSIGN the local array to trigger Angular's change detection
    this.members = this.teamStore.getMembers(teamId);
  });
}


}
