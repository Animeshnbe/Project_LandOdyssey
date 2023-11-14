// Initialize the map
// const map = L.map('map').setView([0, 0], 3);
const map = L.map('map', {
    maxZoom: 3.9, // Set the maximum allowed zoom level
    minZoom: 3.9, // Set the minimum allowed zoom level
}).setView([-3, 15], 10);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var geoJSONLayer;

var colorScale = d3.scaleSequential(d3.interpolateViridis).domain([10, 60]);


fetch('african_countries.json')
    .then(response => response.json())
    .then(data => {
        // Loop through the data and add markers for each country
        var markers = [];
        data.forEach(country => {
            // Create a custom popup content
            const popupContent = document.createElement('div');
            popupContent.className = 'custom-popup';
            popupContent.innerHTML = `
                <div class="custom-popup">
                    <h2>${country.name}</h2>
                    <table border = 1>
                        <tr>
                        <td>Population</td>
                        <td>${country.population} million</td>
                        </tr>
                        <tr>
                        <td>Population Density</td>
                        <td>${country.density} persons per square kilometer</td>
                        </tr>
                        <tr>
                        <td>Area</td>
                        <td>${country.area} square kilometer</td>
                        </tr>
                        <tr>
                        <td>Waste Generation</td>
                        <td>${country.waste} million tonne</td>
                        </tr>
                        <tr>
                        <td>Collection efficiency</td>
                        <td>${country.efficiency} percentage</td>
                        </tr>
                        <tr>
                        <td>Percentage of waste recycled</td>
                        <td>${country.recycled} percentage</td>
                        </tr>
                        <tr>
                        <td>Disposal methods</td>
                        <td>${country.methods}</td>
                        </tr>
                    </table>
                    <canvas id="chart-${country.name.replace(/ /g, '-')}" width="100" height="100"></canvas>
                </div>
            `;

            // Create a pie chart inside the popup
            const pieChartCanvas = popupContent.querySelector(`#chart-${country.name.replace(/ /g, '-')}`);
            const ctx = pieChartCanvas.getContext('2d');

            const pieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: country.types,
                    datasets: [{
                        data: country.values, // Replace with your pie chart data
                        backgroundColor: [
                            '#FF5733',
                            '#33FF57',
                            '#5733FF',
                            '#FF33A1',
                            '#33A1FF',
                            '#FFC733',
                            '#33FFEA',
                            '#FF337D',
                            '#33FF6F',
                            '#FFBD33',
                        ], // Customize colors
                    }],
                },
                options: {
                    responsive: true,
                },
            });

            const marker = L.marker([country.lat, country.lon])
                .addTo(map)
                .bindPopup(popupContent, { maxWidth: 300 }) // Set max width for the popup
                .on('click', () => {
                    // Open the popup when the marker is clicked
                    L.popup().setContent(popupContent).setLatLng([country.lat, country.lon]).openOn(map);
                });
            markers.push(marker);
        });

        var showMarkersCheckbox = document.getElementById('waste');

        showMarkersCheckbox.addEventListener('change', () => {
            if (showMarkersCheckbox.checked) {
                markers.forEach(marker => marker.addTo(map));
            } else {
                markers.forEach(marker => map.removeLayer(marker));
            }
        });

        // button toggle for Hunder Index
        var hungerCheckbox = document.getElementById('hunger');
        hungerCheckbox.addEventListener('change', () => {
            if (hungerCheckbox.checked) {
                geoJSONLayer_Hunger.addTo(map);
            } else if (map.hasLayer(geoJSONLayer_Hunger)) {
                map.removeLayer(geoJSONLayer_Hunger);
            }
        });

        // button toggle for Human developemnt Index
        var DevCheckbox = document.getElementById('dev');
        DevCheckbox.addEventListener('change', () => {
            if (DevCheckbox.checked) {
                geoJSONLayer_Dev.addTo(map);
            } else if (map.hasLayer(geoJSONLayer_Dev)) {
                map.removeLayer(geoJSONLayer_Dev);
            }
        });

        // button toggle for Human capital Index
        var CapitalCheckbox = document.getElementById('capital');
        CapitalCheckbox.addEventListener('change', () => {
            if (CapitalCheckbox.checked) {
                geoJSONLayer_HCI.addTo(map);
            } else if (map.hasLayer(geoJSONLayer_HCI)) {
                map.removeLayer(geoJSONLayer_HCI);
            }
        });

        // button toggle for Human mortality rate
        var MortalityCheckbox = document.getElementById('mortality');
        MortalityCheckbox.addEventListener('change', () => {
            if (MortalityCheckbox.checked) {
                geoJSONLayer_Mortality.addTo(map);
            } else if (map.hasLayer(geoJSONLayer_Mortality)) {
                map.removeLayer(geoJSONLayer_Mortality);
            }
        });

        // button toggle for Infant mortality rate
        var InfantCheckbox = document.getElementById('infant');
        InfantCheckbox.addEventListener('change', () => {
            if (InfantCheckbox.checked) {
                geoJSONLayer_Infant.addTo(map);
            } else if (map.hasLayer(geoJSONLayer_Infant)) {
                map.removeLayer(geoJSONLayer_Infant);
            }
        });

        // next card
        const block1 = document.querySelector('.block-3');
        const block2 = document.querySelector('.block-4');
        
        // Get the height of block-1 dynamically
        const block1Height = block1.clientHeight;
        
        // Set the top property of block-2 based on block-1's height
        const windowHeight = window.innerHeight;
        const gap = (windowHeight * 5) / 100;
        block2.style.top = `${block1Height + gap}px`;

        const images = document.querySelectorAll(".n");
        const rightBtn = document.querySelector("#right");
        const leftbtn = document.querySelector("#left");
        let index = 0;
        let imgnames = ["Soil Aridity", "Desertification", "Severity of degradation", "Rainfall", "Topsoil loss", "Productivity", "Soil nutrients"];
        const caption = document.getElementById("imageNumber");
        caption.textContent = `${imgnames[0]}`;

        rightBtn.addEventListener("click", (_) => {
            if (index >= images.length - 1) {
                index = 0;
                images.forEach((image) => {
                    image.style.left = "0";
                });
            } else {
                images[index].style.left = "-500px";
                index += 1;
            }
            caption.textContent = `${imgnames[index]}`;
        });

        leftbtn.addEventListener("click", (_) => {
            if (index <= 0) {
                index = images.length - 1;
                for (let i = 0; i < images.length - 1; i++) {
                    images[i].style.left = "-500px";
                }
            } else {
                index -= 1;
                images[index].style.left = "0";
            }
            caption.textContent = `${imgnames[index]}`;
        });
    });

fetch('africa_mines.json')
    .then(response => response.json())
    .then(data => {
        var all_mines = [];
        const commodityColorMapping = {
            'Coal': 'black',
            'Chromium': 'red',
            'Copper': '#5c3027',
            'Gold': 'yellow',
            'Platinum': 'blue',
            'Uranium': 'green',
            'Diamond': '#d1f0ef'
            // Add more commodity types and colors as needed
        };
        
        data.forEach(country => {
            const popupContent = document.createElement('div');
            popupContent.className = 'mines-popup';
            popupContent.innerHTML = `
                <div class="custom-popup">
                    <h2>${country.name}</h2>
                    <table border = 1>
                        <tr>
                        <td>Commodity</td>
                        <td>${country.commodity}</td>
                        </tr>
                        <tr>
                        <td>Inception Year</td>
                        <td>${country.inception_year}</td>
                        </tr>
                        <tr>
                        <td>Production</td>
                        <td>${country.production} kgs/day</td>
                        </tr>
                        <tr>
                        <td>Energy Consumption in kWh/t</td>
                        <td>${country.energy_consumption}</td>
                        </tr>
                    </table>
                </div>
            `;
            var regex = /\((-?\d+\.\d+), (-?\d+\.\d+)\)/;
            var matches = country.location.match(regex);

            var latitude = parseFloat(matches[1]);
            var longitude = parseFloat(matches[2]);

            let markerColor = commodityColorMapping[country.commodity] || 'gray';
            // console.log(markerColor);
            const marker = L.marker([latitude, longitude], { icon: L.divIcon({ iconSize: [10, 10], html: `<div class='square' style="background-color: ${markerColor}"></div>` }) })
                .bindPopup(popupContent, { maxWidth: 300 }) // Set max width for the popup
                .on('click', () => {
                    L.popup().setContent(popupContent).setLatLng([country.lat, country.lon]).openOn(map);
                });
            all_mines.push(marker);
        });

        var mineMarker = document.getElementById('mines');
        mineMarker.addEventListener('change', () => {
            // console.log(all_mines);
            if (mineMarker.checked) {
                all_mines.forEach(marker => marker.addTo(map));
            } else {
                all_mines.forEach(marker => map.removeLayer(marker));
            }
        });
    });

fetch('landfill_loc.json')
    .then(response => response.json())
    .then(data => {
        var landfills = [];
        
        data.forEach(item => {
            const popupContent = document.createElement('div');
            popupContent.className = 'mines-popup';
            popupContent.innerHTML = `
                <div class="custom-popup">
                    <h2>${item.name}</h2>
                </div>
            `;

            const marker = L.marker([item.lat, item.lon], { icon: L.icon({ iconSize: [20, 20], iconUrl: `img/delete.png` }) })
                .bindPopup(popupContent, { maxWidth: 300 })
                .on('click', () => {
                    L.popup().setContent(popupContent).setLatLng([country.lat, country.lon]).openOn(map);
                });
            landfills.push(marker);
        });

        var mineMarker = document.getElementById('landfills');
        mineMarker.addEventListener('change', () => {
            // console.log(landfills);
            if (mineMarker.checked) {
                landfills.forEach(marker => marker.addTo(map));
            } else {
                landfills.forEach(marker => map.removeLayer(marker));
            }
        });
    });
    
// Defining layer for Human Hunger Index
fetch('africa.geojson')
    .then((response) => response.json())
    .then((data) => {
        geoJSONLayer_Hunger = L.geoJSON(data, {
            style: (feature) => {
                if (feature.properties.GHI > 30){
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'red',
                        weight: 1, };
                }
                else{
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'green',
                        weight: 1, };
                }
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.ADMIN+": Global Hunder Index: "+feature.properties.GHI);
            },
        });
    });

// Defining layer for Human Development Index
fetch('africa.geojson')
    .then((response) => response.json())
    .then((data) => {
        geoJSONLayer_Dev = L.geoJSON(data, {
            style: (feature) => {
                if (feature.properties.HDI > 0.5){
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'red',
                        weight: 1, };
                }
                else{
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'green',
                        weight: 1, };
                }
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.ADMIN+": Human Development Index: "+feature.properties.HDI);
            },
        });
    });

// Defining layer for Human Capital Index
fetch('africa.geojson')
    .then((response) => response.json())
    .then((data) => {
        geoJSONLayer_HCI = L.geoJSON(data, {
            style: (feature) => {
                if (feature.properties.HCI > 0.4){
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'red',
                        weight: 1, };
                }
                else{
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'green',
                        weight: 1, };
                }
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.ADMIN+": Human Capital Index: "+feature.properties.HCI);
            },
        });
    });

// Defining layer for Human Mortality Index
fetch('africa.geojson')
    .then((response) => response.json())
    .then((data) => {
        geoJSONLayer_Mortality = L.geoJSON(data, {
            style: (feature) => {
                if (feature.properties.MORT  > 1250){
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'red',
                        weight: 1, };
                }
                else{
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'green',
                        weight: 1, };
                }
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.ADMIN+": Human Mortality: "+feature.properties.MORT);
            },
        });
    });

// Defining layer for Infant Mortality Index
fetch('africa.geojson')
    .then((response) => response.json())
    .then((data) => {
        geoJSONLayer_Infant = L.geoJSON(data, {
            style: (feature) => {
                if (feature.properties.INFM  > 5){
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'red',
                        weight: 1, };
                }
                else{
                    return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'green',
                        weight: 1, };
                }
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.ADMIN+": Infant Mortality: "+feature.properties.INFM);
            },
        });
    });


var encodedKeywords = encodeURIComponent('africa land issues desertification');

var url = 'https://newsapi.org/v2/everything?' +
`q=${encodedKeywords}&` +
'from=2023-09-04&' +
'sortBy=popularity&' +
'apiKey=5e20f1995abc4304993763e0f6566867';

var req = new Request(url);

fetch(req)
.then(response => response.json()).then(data => {
    // console.log(data);
    const ul = document.getElementById('news-list');
    for (let i = 0; i < Math.min(data['articles'].length, 5); i++) {
        const article = data['articles'][i];
        const li = document.createElement('li');

        li.innerHTML = article.description.split("Read more...")[0] +`<a href="${article.url}"> more</a>`;

        ul.appendChild(li);
    }
    
});
    

const map2 = L.map('map2', {
    maxZoom: 2.7, // Set the maximum allowed zoom level
    minZoom: 2.6, // Set the minimum allowed zoom level
}).setView([-3, 15], 1);


// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
// }).addTo(map2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map2);

function generateImage(countryname) {
    const group1Selected = document.querySelector('input[name="group1"]:checked');
    const group2Selected = document.querySelector('input[name="group2"]:checked');

    if (!group1Selected || !group2Selected) {
        alert("Please select options from both groups before clicking Go.");
        return;
    }
    const imageSource = `plots/${countryname}/${group1Selected.value}_${group2Selected.value}.png`;
    
    console.log(imageSource);
    const img = new Image();
    img.onload = function () {
        document.getElementById('plot-data').src = imageSource;
    };
    img.onerror = function () {
        document.getElementById('plot-data').src = 'no_data.jpg';
    };
    img.src = imageSource;
    // document.getElementById('plot-data').src = imageSource;
    document.getElementById('countryplot').style.display = 'block';
}

function closeModal(){
    document.getElementById('countryplot').style.display = 'none';
}

fetch('africa.geojson')
    .then((response) => response.json())
    .then((data) => {
        
        
        geoJSONPlotLayer = L.geoJSON(data, {
            style: (feature) => {
                return { fillColor: colorScale(feature.properties.colorValue), 
                        fillOpacity: 0.4,
                        color: 'blue',
                        weight: 1, };
            },
            onEachFeature: function (feature, layer) {
                const popupContent = document.createElement('div');
                popupContent.innerHTML = `<h2> ${feature.properties.ADMIN}</h2>
                <form id="imageForm">
                    <label>
                        Index:
                        <input type="radio" name="group1" value="hdi"> HDI
                        <input type="radio" name="group1" value="mort"> Mortality
                        <input type="radio" name="group1" value="ghi"> Hunger
                        <input type="radio" name="group1" value="conflict-and-terror"> Conflicts
                    </label>
                    <br>
                    <label>
                        Environment:
                        <input type="radio" name="group2" value="gold-prod"> Mining
                        <input type="radio" name="group2" value="deforestation"> Deforestation
                        <input type="radio" name="group2" value="degraded"> Land Degradation
                        <input type="radio" name="group2" value="ghg"> Emissions
                    </label>
                    <br>
                    <button type="button" onclick="generateImage('${feature.properties.ADMIN}')">Go</button>
                </form>`;
                // popupContent.innerHTML = `<img src='plots/${feature.properties.ADMIN}/${random}'/>`;
                layer.bindPopup(popupContent, { maxWidth: 300 });
            },
        });
        geoJSONPlotLayer.addTo(map2);
    });