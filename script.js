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

        var hungerCheckbox = document.getElementById('hunger');

        hungerCheckbox.addEventListener('change', () => {
            if (hungerCheckbox.checked) {
                geoJSONLayer.addTo(map);
            } else if (map.hasLayer(geoJSONLayer)) {
                map.removeLayer(geoJSONLayer);
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

fetch('africa.geojson')
    .then((response) => response.json())
    .then((data) => {
        geoJSONLayer = L.geoJSON(data, {
            style: (feature) => {
              return { fillColor: colorScale(feature.properties.colorValue), 
                fillOpacity: 0.4,
                color: 'black',
                weight: 1, };
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.ADMIN+" "+toString(feature.properties.ghi));
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
    
