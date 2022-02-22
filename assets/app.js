const  cityInput =document.querySelector("#city");
const  cityForm =document.querySelector("#city-search-form");
const  citySearchInput = document.querySelector("#searched-city");
const  forecastHeading = document.querySelector("#forecast");
const  weatherContainer =document.querySelector("#current-weather-container");
const  forecastContainer = document.querySelector("#fiveday-container");
const  pastSearchButtonEl = document.querySelector("#past-search-buttons");

// array to hold cities
const cities = [];

// fetching data from openweathermap
const getCityWeather = function(city){
    let apiKey = "67011b80a1ad30e6c7d25249c4608926"
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

// event for form submission
const formSumbitHandler = function(event){
    event.preventDefault();
    let city = cityInput.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Must enter a City");
    }
    saveSearch();
    prevSearch(city);
}

// save search with local storage
const saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};




// function that displays weather with span elements for temp, humidity, and windspeed. Also creates an image elem and appends everything to the container

const displayWeather = function(weather, searchCity){
   
    citySearchInput.textContent = searchCity;
    
    weatherContainer.textContent= "";  
    
   let currentDate = document.createElement("span")
   currentDate.textContent= "(" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(currentDate);

   
   let weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInput.appendChild(weatherIcon);

   let temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
  
   let humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

  let windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

  
   
   
   weatherContainer.appendChild(temperatureEl);
   
   weatherContainer.appendChild(humidityEl);
   let lat = weather.coord.lat;
   weatherContainer.appendChild(windSpeedEl);
   let lon = weather.coord.lon;
   getUv(lat,lon)
}

// fetch function to receive UvIndex data

const getUv = function(lat,lon){
    let apiKey = "67011b80a1ad30e6c7d25249c4608926"
    let apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUv(data)
           
        });
    });

}


// function to display UV in different colors when its favorable, moderate, or severe
 
const displayUv = function(index){
    let uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value > 2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value > 8){
        uvIndexValue.classList = "severe"
    };

    uvIndex.appendChild(uvIndexValue);

    weatherContainer.appendChild(uvIndex);
}

// fetch function to get 5day forecast
const get5Day = function(city){
    let apiKey = "67011b80a1ad30e6c7d25249c4608926"
    let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

// function to display 5day forecast with an image elem, and temperature and forecast info and append it to the forecast card

const display5Day = function(weather){
    forecastContainer.textContent = ""
    forecastHeading.textContent = "5-Day Forecast:";

    const forecast = weather.list;
        for(let i = 5; i < forecast.length; i = i + 8){
       let dailyForecast = forecast[i];
        
       
       let forecastEl = document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       let forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       let weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  


       forecastEl.appendChild(weatherIcon);

       let forecastTemp = document.createElement("span");
       forecastTemp.classList = "card-body text-center";
       forecastTemp.textContent = "Temp: " + dailyForecast.main.temp + " °F";

        forecastEl.appendChild(forecastTemp);

       let forecastHumid=document.createElement("span");
       forecastHumid.classList = "card-body text-center";
       forecastHumid.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";

       forecastEl.appendChild(forecastHumid);

        forecastContainer.appendChild(forecastEl);
    }

}

// function for previous search

const prevSearch = function(prevSearch){

    prevSearchEl = document.createElement("button");
    prevSearchEl.textContent = prevSearch;
    prevSearchEl.classList = "d-flex w-100 btn-light border p-2";
    prevSearchEl.setAttribute("data-city",prevSearch)
    prevSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(prevSearchEl);
}

// event handler for previous search

const pastSearchHandler = function(event){
    let city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}


pastSearchButtonEl.addEventListener("click", pastSearchHandler);
cityForm.addEventListener("submit", formSumbitHandler);
