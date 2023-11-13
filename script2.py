import json
# import csv

# countries = ["Ethiopia", "Ghana", "Mozambique", "Namibia", "South Africa", "Tanzania", "Uganda"]
cat = {"sa": ["Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zimbabwe"], 
    "sahel": ["Burkina Faso", "Chad", "Ethiopia", "Eritrea", "Mali", "Mauritania", "Niger", "Nigeria", "Senegal", "Sudan"],
    "horn": ["Ethiopia", "Eritrea", "Djibouti", "Somalia"],
    "glakes": ["Malawi", "Rwanda", "Tanzania", "Uganda"]}

all = ["Cameroon", "Chad", "Congo", "Djibouti", "Eritrea", "Eswatini", "Ethiopia", "Lesotho", "Malawi", "Mali", "Mauritania", 
       "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Somalia", "South Africa", "Sudan", "Tanzania", "Uganda", "Zimbabwe"]



def get_data(mp):
    with open(mp+".json", "r") as f:
        mapping = json.load(f)
    return mapping

mapping = {}
for data in ["ghi","hdi","hci","mort","infm"]:
    mapping[data] = get_data(data)

# with open('ghg.json', 'r') as f:
#     ghg_mapping = json.load(f)

# with open('farea.json', 'r') as f:
#     farea_mapping = json.load(f)

with open('countries.geojson', 'r') as geojson_file:
    geojson_data = json.load(geojson_file)

filtered_features = []
for feature in geojson_data['features']:
    # properties = feature['properties']
    if feature['properties'].get("ADMIN") in all:
        country = feature['properties']["ADMIN"]
        for mp,val in mapping.items():
            if country in val:
                feature['properties'][mp.upper()] = val[country]
            else:
                feature['properties'][mp.upper()] = -1
        filtered_features.append(feature)

# Create a new dictionary with only the filtered features
filtered_geojson_data = {
    "type": "FeatureCollection",
    "features": filtered_features
}

with open('africa.geojson', 'w') as output_file:
    json.dump(filtered_geojson_data, output_file)