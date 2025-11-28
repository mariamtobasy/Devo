using Microsoft.EntityFrameworkCore;
using DevoBackend.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DevoBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// -------------------------
// 1️⃣ Configure DbContext
// -------------------------
builder.Services.AddDbContext<DevoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// -------------------------
// 2️⃣ Add JWT service
// -------------------------
builder.Services.AddSingleton<JwtService>();

// Read JWT settings
var jwtSection = builder.Configuration.GetSection("Jwt");
var key = jwtSection["Key"];
var issuer = jwtSection["Issuer"];
var audience = jwtSection["Audience"];

// -------------------------
// 3️⃣ Add controllers
// -------------------------
builder.Services.AddControllers();

// -------------------------
// 4️⃣ Configure JWT authentication
// -------------------------
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = issuer,
    ValidAudience = audience,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
  };
});
//.AddCookie(); // Optional cookie auth

// -------------------------
// 5️⃣ Configure CORS (for Angular)
// -------------------------
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngular", policy =>
      policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// -------------------------
// 6️⃣ Configure Swagger
// -------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new() { Title = "Devo API", Version = "v1" });
  c.SupportNonNullableReferenceTypes();
});

var app = builder.Build();

// ✅ Test database connection
using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<DevoDbContext>();
  try
  {
    if (db.Database.CanConnect())
      Console.WriteLine("✅ Connected to database successfully!");
    else
      Console.WriteLine("⚠️ Could not connect to the database!");
  }
  catch (Exception ex)
  {
    Console.WriteLine("❌ Database connection failed: " + ex.Message);
  }
}

// -------------------------
// 7️⃣ Middleware
// -------------------------
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
