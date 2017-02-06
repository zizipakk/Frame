FROM microsoft/aspnetcore:1.1.0
ENTRYPOINT ["dotnet", "FrameAuth.dll"]
ENV ASPNETCORE_ENVIRONMENT=Development 
ARG source=.
WORKDIR /app
COPY $source .
