# SimGo Connect Application 

> Note: MSFS should be running before run this application

An example of SimGo Application integration.

## Parameters

wsPort - port for web socket server (default 4500)
appPort - port of live map application (default 5000)

## Getting Started

Run from source:

```
go download
go run . --wsPort=35600 --appPort=35700
```

Build executable and run:

```
go download
set CGO_ENABLED=1
set GOOS=windows
set GOARCH=amd64
set GO111MODULE=on

go build -x -o SimGo.exe
SimGo.exe --wsPort=35600 --appPort=35700
```

Or simply un pre-build copy:

```
SimGo.exe --wsPort=35600 --appPort=35700
```

This will run SimGo App, connect to MSFS 2020 and get some data from the simulator and put itr on the map.
