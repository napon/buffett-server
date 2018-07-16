package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type response interface{}

type searchResult struct {
	Symbol string `json:"symbol"`
	Desc   string `json:"desc"`
}

type entity struct {
	Symbol string `json:"symbol"`
	Desc   string `json:"desc"`
	// TODO: more fields here
}

var testSearchOutput = []searchResult{
	searchResult{
		Symbol: "ABC",
		Desc:   "Desc for ABC",
	},
	searchResult{
		Symbol: "DEF",
		Desc:   "Desc for DEF",
	},
}

// Send a 200 response with data
func send(w http.ResponseWriter, data response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	jsonified, _ := json.Marshal(data)
	w.Write(jsonified)
}

// TODO: Search for matching terms
func search(w http.ResponseWriter, r *http.Request) {
	message := r.URL.Path
	message = strings.TrimPrefix(message, "/search/")
	fmt.Println("search " + message)
	send(w, testSearchOutput)
}

// TODO: Look up a specific symbol
func lookup(w http.ResponseWriter, r *http.Request) {
	message := r.URL.Path
	message = strings.TrimPrefix(message, "/lookup/")
	fmt.Println("lookup " + message)
	send(w, testSearchOutput)
}

func main() {
	http.HandleFunc("/lookup/", lookup)
	http.HandleFunc("/search/", search)
	http.ListenAndServe(":8080", nil)
}
