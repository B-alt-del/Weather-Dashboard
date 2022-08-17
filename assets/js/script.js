var key = "cf8752859f31ac5d2b20710ebc12b322";
var citiesArray = [];
var $cityContainerEl = $("#cityContainer");

function start() {
    var cities_stored = JSON.parse(localStorage.getItem("cities"));
    if (cities_stored !== null) {
        citiesArray = cities_stored;
    }
    renderCities();
}

function locally_store_cities() {
    localStorage.setItem("cities", JSON.stringify(citiesArray));
}

function renderCities() {
    $cityContainerEl.empty();

    for (var i = 0; i < citiesArray.length; i++) {
        $cityContainerEl.append(`
            <a data-city="${citiesArray[i]}" class="waves-effect waves-light btn bs">${citiesArray[i]}</a>`
        )
    }
    if (!citiesArray[citiesArray.length - 1]) {
        return
    }else {
        weatherAPIcall(citiesArray[citiesArray.length - 1])
    };
}

$("#searchCity").on("click", function (event) {
    event.preventDefault();
    var city = $("#user_input").val().trim();
    if (city === "") {
        return;
    }
    citiesArray.push(city);
    locally_store_cities();
    renderCities();
});

$(document).on("click", "#cityContainer .btn", function () {
    var clicked = $(this).attr("data-city");
    weatherAPIcall(clicked);
});

function weatherAPIcall(city) {
    var API_url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key;
    
    $.ajax({
        url: API_url,
        method: "GET"
    }).then(function (data) {


        console.log(data)
        var img = '';
        var skies = data.weather[0].main;
        var $imgEl = $('#skies');
        var long = data.coord.lon;
        var lat = data.coord.lat;

        var fullDate = new Date(0); 
        fullDate.setUTCSeconds(data.dt);
        var date = fullDate.toDateString();
        var short_date = date.split(' ').slice(0, 3).join(' ');

        var API_url2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + lat + "&lon=" + long;
        var API_url3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + key;


        if (skies === "Clouds") {
            img = 'https://img.icons8.com/color/48/000000/cloud.png';
        } else if (skies === "Clear") {
            img = 'https://img.icons8.com/color/48/000000/summer.png';
        } else if (skies === "Rain") {
            img = 'https://img.icons8.com/color/48/000000/rain.png';
        }else if (skies === "Thunderstorm"){
            img = 'https://img.icons8.com/color/48/000000/storm-with-heavy-rain.png';
        }

        $imgEl.attr("src", img)
        $imgEl.attr("alt", skies)
        $("#currentCity").text(data.name + '    -     ' + short_date )
        $("#currentTemp").text("Temperature: " + parseInt((data.main.temp) * 9 / 5 - 459) + " °F")
        $("#currentHumid").text("Humidity: " + data.main.humidity + " %")
        $("#currentWind").text("Wind Speed: " + data.wind.speed + " MPH")
        
        $.ajax({
            url: API_url2,
            method: "GET"
        }).then(function (data) {

            var uv = $("#currentUV")
            uv.text("UV Index: ")
            uv.append($("<span id='uvc'>").text(data.value))
            var uvc = $("#uvc")
            
            if (data.value > 0 && data.value <= 2) {
                uvc.attr("class", "green-text-text")
            }else if (data.value > 2 && data.value <= 5) {
                uvc.attr("class", "yellow-text")
            }else if (data.value > 5 && data.value <= 7) {
                uvc.attr("class", "orange-text")
            }else if (data.value > 7 && data.value <= 10) {
                uvc.attr("class", "red-text")
            }else {
                uvc.attr("class", "purple-text")
            }

        });

        $.ajax({
            url: API_url3,
            method: "GET"
        }).then(function (data) {

            var card_data = document.getElementById('forecast');
            $("#forecast").empty();

            console.log(data);

            for (var i = 0; i < 33; i = i + 8) {

                var fullDate = new Date(0); 
                fullDate.setUTCSeconds(data.list[i].dt);
                var date = fullDate.toDateString();
                var short_date = date.split(' ').slice(0, 3).join(' ');
                var sky = data.list[i].weather[0].main;
                var img_url = '';
                var temp = parseInt((data.list[i].main.temp) * 9 / 5 - 459);
                var humid = data.list[i].main.humidity;
                var wind = data.list[i].wind.speed;

                    if (sky === "Clouds") {
                        img_url = 'https://img.icons8.com/color/48/000000/cloud.png';
                    } else if (sky === "Clear") {
                        img_url = 'https://img.icons8.com/color/48/000000/summer.png';
                    } else if (sky === "Rain") {
                        img_url = 'https://img.icons8.com/color/48/000000/rain.png';
                    }else if (sky === "Thunderstorm"){
                        img_url = 'https://img.icons8.com/color/48/000000/storm-with-heavy-rain.png';
                    }
                   
                card_data.innerHTML += `
                    <div class="col s2 card">
                        <div class="card-content">
                            <p>${short_date}</p>
                            <img src="${img_url}" alt="${sky}">
                            <p>Temp: ${temp} °F</p>
                            <p>Wind: ${wind}</p>
                            <p>Humidity: ${humid}%</p>
                        </div>
                    </div>`
            }
        });
    });
}

start();
