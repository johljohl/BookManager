# Använd officiell .NET SDK-bild för att bygga applikationen
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Kopiera projektfiler och bygg applikationen
COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

# Använd en lättare runtime-bild för att köra applikationen
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Exponera porten som applikationen körs på
EXPOSE 80

# Starta applikationen
ENTRYPOINT ["dotnet", "BookApi.dll"]
