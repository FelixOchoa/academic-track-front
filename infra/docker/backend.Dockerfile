# Imagen de ejecución del backend. Recibe la API ya publicada con `dotnet publish`
# (deploy.sh la compila fuera de Docker para no agotar el disco de CloudShell).
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY . .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "AcademicTrack.API.dll"]
