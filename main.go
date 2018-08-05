package main

import (
  "io/ioutil"
	"encoding/json"
	"fmt"
	"net/http"
  "strings"
  "strconv"
  "os"
)

type response interface{}

type searchResult struct {
	Symbol string `json:"symbol"`
	Desc   string `json:"desc"`
}

type lookupResult struct {
  Symbol string `json:"symbol"`
  Prices map[string]string `json:"prices"` // mapping of month - price
}

type initial struct {
  Symbol string `json:"symbol"`
}

type entity struct {
	Symbol string `json:"symbol"`
	Desc   string `json:"desc"`
	// TODO: more fields here
}

type serverResponseMetadata struct {
  Symbol string `json:"2. Symbol"`
}

type serverResponseSingleMonthData struct {
  Open string `json:"1. open"`
  High string `json:"2. high"`
  Low string `json:"3. low"`
  Close string `json:"4. close"`
  Volume string `json:"5. volume"`
}

type serverResponseMonthlyData map[string]serverResponseSingleMonthData

type serverResponse struct {
  Metadata serverResponseMetadata `json:"Meta Data"`
  Data serverResponseMonthlyData `json:"Monthly Time Series"`
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

var initialLoadData = []searchResult{
  searchResult{
    Symbol: "TSLA",
  }, searchResult{
    Symbol: "MSFT",
  }, searchResult{
    Symbol: "FB",
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
	symbol := strings.TrimPrefix(message, "/lookup/")
  fmt.Println("lookup " + symbol)

  // Send to server
  serverResponse1 := serverResponse{}
  resp, err := http.Get(lookupAPI + "&symbol=" + symbol)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer resp.Body.Close()
  body, _ := ioutil.ReadAll(resp.Body)

  // Convert to data JSON
  err = json.Unmarshal(body, &serverResponse1)
  if err != nil {
    fmt.Println(err)
    return
  }
  symbol = serverResponse1.Metadata.Symbol
  fmt.Println("SUCCESS: " + symbol)

  // Convert to client side friendly JSON
  // get last 12 month results
  prices := make(map[string]string, 10)
  finalResponse := lookupResult{}
  finalResponse.Symbol = symbol

  data := serverResponse1.Data
  i := 0
  for k, v := range data { 
    if i >= 10 {
      break
    }
    i = i + 1
    dates := strings.Split(k, "-")
    year := dates[0]
    month, _ := strconv.Atoi(dates[1])
    formattedDate := months[month-1] + " " + year
    prices[formattedDate] = v.Close
  }

  finalResponse.Prices = prices
	send(w, finalResponse)
}

func initialLoad(w http.ResponseWriter, r *http.Request) {
  send(w, initialLoadData)
}

var lookupAPI = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&apikey="
var months [12]string
func main() {
  months = [...]string{"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}
  lookupAPI = lookupAPI + os.Args[1]

	http.HandleFunc("/lookup/", lookup)
  http.HandleFunc("/search/", search)
  http.HandleFunc("/", initialLoad)
	http.ListenAndServe(":8080", nil)
}
