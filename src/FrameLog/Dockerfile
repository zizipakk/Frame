FROM microsoft/aspnetcore:1.1
ENTRYPOINT ["dotnet", "FrameLog.dll"]
#ENV ASPNETCORE_ENVIRONMENT=Development
#ARG source=.
ARG source
WORKDIR /app
EXPOSE 80
#COPY $source .
COPY ${source:-obj/Docker/publish} .