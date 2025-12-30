using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace DevoBackend.Hubs
{
    public class TeamsHub : Hub
    {
        public async Task JoinTeam(int teamId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Team_{teamId}");
        }

        public async Task LeaveTeam(int teamId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Team_{teamId}");
        }

        public async Task SendMessageToTeam(int teamId, string FullName, string message)
        {
            // Wrap it in an object so the frontend listener handles it correctly
            var chatObj = new
            {
                teamId = teamId,
                senderName = FullName,
                content = message,
                createdAt = DateTime.UtcNow
            };
            await Clients.Group($"Team_{teamId}").SendAsync("ReceiveMessage", chatObj);
        }

        public async Task SendActivity(int teamId, string activity)
        {
            await Clients.Group($"Team_{teamId}").SendAsync("ReceiveActivity", activity);
        }
    }
}