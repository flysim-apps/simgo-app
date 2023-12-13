# SimGo Connect Application 

> Note: Simulator and FSUIPC WebSocket Server should be running before run this application. 

An example of SimGo Application integration.

[FSUIPC WebSocket Server](http://fsuipcwebsockets.paulhenty.com/)

## Parameters

`wsPort` - port for web socket server (default 33500)

`appPort` - port of live map application (default 34500)

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

This will run SimGo App, connect to MSFS 2020/X-Plane 11/12 or Prepar3D and get some data from the simulator and put it on the map.
