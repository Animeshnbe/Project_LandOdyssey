import json
import csv

# countries = ["Ethiopia", "Ghana", "Mozambique", "Namibia", "South Africa", "Tanzania", "Uganda"]
cat = {"sa": ["Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zimbabwe"], 
    "sahel": ["Burkina Faso", "Chad", "Ethiopia", "Eritrea", "Mali", "Mauritania", "Niger", "Nigeria", "Senegal", "Sudan"],
    "horn": ["Ethiopia", "Eritrea", "Djibouti", "Somalia"],
    "glakes": ["Malawi", "Rwanda", "Tanzania", "Uganda"]}

all = ["Botswana", "Burkina Faso", "Chad", "Djibouti", "Eritrea", "Eswatini", "Ethiopia", "Lesotho", "Malawi", "Mali", "Mauritania", 
       "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Somalia", "South Africa", "Sudan", "Tanzania", "Uganda", "Zimbabwe"]


mapping = {}

with open("ghi.csv", "r") as f:
    r = csv.reader(f)
    next(r)
    for row in r:
        if row[0] in all:
            mapping[row[0]] = row[2]

with open('ghg.json', 'r') as f:
    ghg_mapping = json.load(f)

with open('farea.json', 'r') as f:
    farea_mapping = json.load(f)

with open('countries.geojson', 'r') as geojson_file:
    geojson_data = json.load(geojson_file)

filtered_features = []
for feature in geojson_data['features']:
    # properties = feature['properties']
    if feature['properties'].get("ADMIN") in all:
        country = feature['properties']["ADMIN"]
        if country in mapping:
            feature['properties']["GHI"] = mapping[country]
        filtered_features.append(feature)

# Create a new dictionary with only the filtered features
filtered_geojson_data = {
    "type": "FeatureCollection",
    "features": filtered_features
}

with open('africa.geojson', 'w') as output_file:
    json.dump(filtered_geojson_data, output_file)