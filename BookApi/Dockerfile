# Använd officiell .NET SDK-bild för att bygga applikationen
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Kopiera och återställ projektberoenden
COPY *.csproj ./
RUN dotnet restore

# Kopiera hela koden och bygg applikationen
COPY . ./
RUN dotnet publish BookApi.csproj -c Release -o out

# Använd en lättare runtime-bild för att köra applikationen
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Exponera port 80 för trafik
EXPOSE 80

# Starta applikationen
ENTRYPOINT ["dotnet", "BookApi.dll"]
