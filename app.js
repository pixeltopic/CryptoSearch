/*
how app will work:
user searches for a coin (.CoinName or .Symbol) and selects a currency to display details in. (USD, EUR, CAD...)
fetchDescription gets the Image and other basic data from the search input.
fetchAverage gets the statistics from the .Symbol and currency (USD, EUR, CAD...)

display all relevant information for the user.

Averages fetched 7 different exchanges. API provided by Cryptocompare.
*/



{ // IIFE: gets info from the API link. Uses UIcontroller functions to update interface.
    
    function fetchDescription(coinName, exchangeInput, curInput) {
        
        let apiURL = "https://min-api.cryptocompare.com/data/all/coinlist";
        
        fetch(apiURL, {mode:"cors"}).then(function(response) { // mode:"cors" required for https links
            return response.json();
        }).then(function(response) {
            console.log("fetchDescription: Fetched");
            
//            console.log(response);
//            console.log(response.Data);
            
            // iterate though response.Data for the .CoinName or .Symbol that matches coinName attr.
            for (let DataEntry in response.Data) {
                let dataObj = response.Data[DataEntry];
                if (dataObj.CoinName.toUpperCase() === coinName || dataObj.Symbol === coinName) {
                    
                    return {
                        BaseImageUrl: response.BaseImageUrl,
                        CoinName: dataObj.CoinName,
                        FullName: dataObj.FullName,
                        ImageUrl: dataObj.ImageUrl,
                        Symbol: dataObj.Symbol,
                        
                    };
                }
            }
            
            return -1; // JSON fetched successfully, but Response was an error (maybe because search was invalid)
            
        }).then(function(obj) {
            if (obj !== -1) {
                updatePicture(obj.BaseImageUrl, obj.ImageUrl);
                updateSearchDetails(obj.CoinName, obj.Symbol, exchangeInput, curInput);
                fetchAverage(obj.Symbol, exchangeInput, curInput);
            } else {
                console.log("fetchDescription: Invalid CoinName or Symbol");
                
                var invalidSearch = document.getElementById("search-snackbar");
                invalidSearch.textContent = "Search Didn't Find Anything!";
                invalidSearch.className = "show";
                setTimeout(function(){ invalidSearch.className = invalidSearch.className.replace("show", ""); }, 3000);
            }
            
        }).catch(function(err) {
            console.log(err);
        });
    }
    
    function fetchAverage(coin = "BTC", exchange = "Coinbase", cur = "USD") { // set cur by dropdown: USD, CAD, EUR.
        
        let apiURL = `https://min-api.cryptocompare.com/data/generateAvg?fsym=${coin}&tsym=${cur}&e=${exchange}`;
        
        fetch(apiURL, {mode:"cors"}).then(function(response) {
            return response.json();
        }).then(function(response) {
            if (response.Response === "Error") {
                console.log("fetchAverage: API Url was Invalid, likely no exchange for that currency.");
                
                var invalidSearch = document.getElementById("search-snackbar");
                invalidSearch.textContent = "No Exchange for Selected Inputs!";
                invalidSearch.className = "show";
                setTimeout(function(){ invalidSearch.className = invalidSearch.className.replace("show", ""); }, 3000);
                
                return -1;
            } else {
                console.log("Fetched Averages");
                console.log(response);
                
                let statDetail = response.DISPLAY;
                
                return {
                    PRICE: statDetail.PRICE,
                    CHANGE24HOUR: statDetail.CHANGE24HOUR,
                    CHANGEPCT24HOUR: statDetail.CHANGEPCT24HOUR,
                    VOLUME24HOUR: statDetail.VOLUME24HOUR,
                    VOLUME24HOURTO: statDetail.VOLUME24HOURTO,
                    OPEN24HOUR: statDetail.OPEN24HOUR,
                    LOW24HOUR: statDetail.LOW24HOUR,
                    HIGH24HOUR: statDetail.HIGH24HOUR
                }
            }
            
//            console.log(response.Display);
        }).then(function(obj) {
            if (obj !== -1) {
                updateStatsDetails(obj);
                
                var successSearch = document.getElementById("search-snackbar");
                successSearch.textContent = "Info Updated Successfully";
                successSearch.className = "show";
                setTimeout(function(){ successSearch.className = successSearch.className.replace("show", ""); }, 3000);
                
            } else {
                let invalidSearchObj = {
                    PRICE: "N/A",
                    CHANGE24HOUR: "N/A",
                    CHANGEPCT24HOUR: 0,
                    VOLUME24HOUR: "N/A",
                    VOLUME24HOURTO: 0,
                    OPEN24HOUR: "N/A",
                    LOW24HOUR: 0,
                    HIGH24HOUR: 0
                }
                updateStatsDetails(invalidSearchObj);
            }
            
        }).catch(function(err) {
            console.log(err);
        });;
    }
}

{ // IIFE: UIcontroller, functions that handle UI updates
    
    let DOMstr = {
        coinSearchInput: ".coin-search-input",
        exchangeInput: ".exchange__input",
        curInput: ".cur__input",
        btnInput: ".btn-fetch",
        
        coinLogo: ".coinlogo",
        
        statsDetail: ".stats__detail"
    }
    
    function getInput() {
        // gets all user input and returns an object
        return {
            searchInput: document.querySelector(DOMstr.coinSearchInput).value.toUpperCase(),
            exchangeInput: document.querySelector(DOMstr.exchangeInput).value,
            curInput: document.querySelector(DOMstr.curInput).value
            
        }
    }
    
    function dropdownInit() {
        
        let exchangeOptions = ["CoinBase", "GDAX", "BitTrex", "Kraken", "Gemini", "QuadrigaCX", "Binance"];
        let curOptions = ["USD", "CAD", "EUR", "USDT", "BTC", "ETH"];
        
        
        let exchangeDropdown = document.querySelector(DOMstr.exchangeInput);
        let curDropdown = document.querySelector(DOMstr.curInput);
        
        for (let i = 0; i < exchangeOptions.length; i++) {
            if (i === 0) {
                exchangeDropdown.innerHTML += `<option value="${exchangeOptions[i]}" selected>${exchangeOptions[i]}</option>`;
            } else {
                exchangeDropdown.innerHTML += `<option value="${exchangeOptions[i]}">${exchangeOptions[i]}</option>`;
            }
        }
        
        for (let i = 0; i < curOptions.length; i++) {
            if (i === 0) {
                curDropdown.innerHTML += `<option value="${curOptions[i]}" selected>${curOptions[i]}</option>`;
            } else {
                curDropdown.innerHTML += `<option value="${curOptions[i]}">${curOptions[i]}</option>`;
            }
        }
        
        
    }
    
    function buttonInit() { 
        // initializes all button functionality
        document.querySelector(DOMstr.btnInput).addEventListener("click", () => {
            
            var allInput = getInput();
            
            if (allInput.searchInput.length !== 0){
                fetchDescription(allInput.searchInput, allInput.exchangeInput, allInput.curInput);
            } else {
                console.log("input was empty!");
                var emptySearch = document.getElementById("search-snackbar");
                emptySearch.textContent = "Input Is Empty.";
                emptySearch.className = "show";
                setTimeout(function(){ emptySearch.className = emptySearch.className.replace("show", ""); }, 3000);
            }
        });
    }
    
    function updateSearchDetails(coin, coinSymbol, exchange, cur) {
//        document.getElementById("SEARCH-DETAILS").textContent = `Coin: ${coin} (${coinSymbol}) | Exchange: ${exchange} | Currency: ${cur}`;
        document.getElementById("COINNAME").textContent = coin;
        document.getElementById("EXCHANGE").textContent = exchange;
        document.getElementById("CURRENCY").textContent = cur;
        
    }
    
    function updatePicture(baseImageUrl, imageUrl) {
        document.querySelector(DOMstr.coinLogo).src = baseImageUrl + imageUrl;
    }
    
    function updateStatsDetails(obj) {
        
//        let details = document.querySelectorAll(DOMstr.statsDetail);
//        let detailArr = Array.from(details);
        
        document.getElementById("PRICE").textContent = `${obj.PRICE}`;
        document.getElementById("CHANGE24HOUR").textContent = `${obj.CHANGE24HOUR} (${obj.CHANGEPCT24HOUR}%)`;
        document.getElementById("VOLUME24HOUR").textContent = `${obj.VOLUME24HOUR} (${obj.VOLUME24HOURTO})`;
        document.getElementById("OPEN24HOUR").textContent = `${obj.OPEN24HOUR}`;
        document.getElementById("LOWHIGH24HOUR").textContent = `${obj.LOW24HOUR} - ${obj.HIGH24HOUR}`;
        
        let now = new Date();
        let timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} - ${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`
        
        document.getElementById("TIMESTAMP").textContent = `${timestamp}`;
    }
    
}

buttonInit();
dropdownInit();