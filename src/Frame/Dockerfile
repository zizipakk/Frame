FROM microsoft/aspnetcore:1.1.0
ENTRYPOINT ["dotnet", "Frame.dll"]
ENV ASPNETCORE_ENVIRONMENT=Development 
ARG source=.
WORKDIR /app
EXPOSE 80
COPY $source .
