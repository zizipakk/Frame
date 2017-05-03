FROM microsoft/aspnetcore:1.1
ENTRYPOINT ["dotnet", "FrameAuth.dll"]
#ENV ASPNETCORE_ENVIRONMENT=Development
#ARG source=.
ARG source
WORKDIR /app
#COPY $source .
EXPOSE 80
COPY ${source:-obj/Docker/publish} .