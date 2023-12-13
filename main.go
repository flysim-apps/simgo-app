package main

import (
	"context"
	"embed"
	"encoding/json"
	"flag"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"
	"strings"
	"time"

	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
	"github.com/flysim-apps/simgo"
	"github.com/gorilla/mux"
	"github.com/op/go-logging"
)

//go:embed app/build/*
var appContent embed.FS

type Report struct {
	Title    string  `json:"title"`
	Agl      int     `json:"alt"`
	Lat      float64 `json:"lat"`
	Lon      float64 `json:"lon"`
	Heading  float64 `json:"hdg"`
	Airspeed int     `json:"spd"`
}

type Message struct {
	Event string    `json:"event"`
	Data  Report    `json:"data"`
	Time  time.Time `json:"time"`
}

var logger = logging.MustGetLogger("simgo")

func main() {
	wsPortFlag := flag.String("wsPort", "33500", "web socket port")
	appPortFlag := flag.String("appPort", "34500", "application port")
	flag.Parse()

	sim := simgo.NewSimGo(logger, simgo.FSUIPC)

	if err := sim.StartWebSocket(":" + *wsPortFlag); err != nil {
		panic(err.Error())
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := sim.FSUIPC(ctx, "ws://localhost:2048/fsuipc/"); err != nil {
		panic("Unable to establish websocket connection: " + err.Error())
	}

	if err := sim.OffsetPolling("event", simgo.Offsets{}, 1000); err != nil {
		sim.Logger.Errorf("Failed to obtain polling: %s", err.Error())
	}
	if err := sim.Payload(10000); err != nil {
		sim.Logger.Errorf("Failed to obtain payload: %s", err.Error())
	}

	eventChan := make(chan interface{})
	payloadChan := make(chan interface{})

	sim.ReadData("event", simgo.Report{}, eventChan, payloadChan)

	go func() {
		for {
			select {
			case result := <-eventChan:
				logger.Debugf("Event: %+v", result)
				pkt := &Message{
					Event: "track",
					Data:  convert(result.(simgo.Report)),
					Time:  time.Now(),
				}
				buf, _ := json.Marshal(pkt)
				sim.Socket.BroadcastByte(buf)
			case result := <-payloadChan:
				logger.Debugf("Payload: %+v", result)
			case err := <-sim.Error:
				logger.Errorf("Track failed: %s", err.Error())
				return
			}
		}
	}()

	var a, _ = astilectron.New(log.New(os.Stderr, "", 0), astilectron.Options{
		AppName:            "SimGo App",
		AppIconDefaultPath: "./app/public/favicon-32x32.png", // If path is relative, it must be relative to the data directory
	})

	defer a.Close()

	// Start astilectron
	a.Start()

	StartSPA(*appPortFlag)

	logger.Info("Start map on address: http://127.0.0.1:" + *appPortFlag + "/#wsPort" + *wsPortFlag)

	var w, _ = a.NewWindow("http://127.0.0.1:"+*appPortFlag+"/#wsPort"+*wsPortFlag, &astilectron.WindowOptions{
		Center: astikit.BoolPtr(true),
		Height: astikit.IntPtr(1080),
		Width:  astikit.IntPtr(1920),
	})
	w.Create()

	// Blocking pattern
	a.Wait()
}

func StartSPA(port string) {
	router := mux.NewRouter()
	spa := spaHandler{staticFS: appContent, staticPath: "app/build", indexPath: "index.html", prefixPath: ""}
	router.PathPrefix("/").Handler(spa)

	srv := &http.Server{
		Addr:         ":" + port,
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      router,
	}
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			logger.Error(err)
		}
	}()
}

type spaHandler struct {
	staticFS   embed.FS
	staticPath string
	indexPath  string
	prefixPath string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// get the absolute path to prevent directory traversal
	// path, err := path.Abs(r.URL.Path)
	// if err != nil {
	// 	// if we failed to get the absolute path respond with a 400 bad request
	// 	// and stop
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }
	pathr := path.Clean(path.Join(h.staticPath, r.URL.Path))

	// prepare prefix compatible with windows
	prefixPath := h.prefixPath

	// prepend the path with the path to the static directory
	pathr = strings.ReplaceAll(pathr, prefixPath, "")

	// check whether a file exists at the given path
	_, err := h.staticFS.Open(pathr)
	if os.IsNotExist(err) {
		// file does not exist, serve index.html
		index, err := h.staticFS.ReadFile(path.Join(h.staticPath, h.indexPath))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusAccepted)
		w.Write(index)
		return
	} else if err != nil {
		// if we got an error (that wasn't that the file doesn't exist) stating the
		// file, return a 500 internal server error and stop
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.URL.Path = strings.ReplaceAll(r.URL.Path, h.prefixPath, "")

	statics, err := fs.Sub(h.staticFS, h.staticPath)
	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.FS(statics)).ServeHTTP(w, r)
}

func convert(payload simgo.Report) Report {
	return Report{
		Agl:      payload.Agl,
		Lat:      payload.Lat,
		Lon:      payload.Lon,
		Heading:  calcHeadingMagvar(payload.Heading, payload.MagVar),
		Airspeed: payload.AirspeedTrue,
		Title:    payload.Title,
	}
}

func calcHeadingMagvar(heading float64, magvar float64) float64 {
	if int64(heading) == 0 {
		heading = heading + 360
	}
	return heading + (magvar * -1)
}
