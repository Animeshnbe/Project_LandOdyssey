import json
import csv

# countries = ["Ethiopia", "Ghana", "Mozambique", "Namibia", "South Africa", "Tanzania", "Uganda"]
cat = {"sa": ["Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zimbabwe"], 
    "sahel": ["Burkina Faso", "Chad", "Ethiopia", "Eritrea", "Mali", "Mauritania", "Niger", "Nigeria", "Senegal", "Sudan"],
    "horn": ["Ethiopia", "Eritrea", "Djibouti", "Somalia"],
    "glakes": ["Malawi", "Rwanda", "Tanzania", "Uganda"]}

all = ["Botswana", "Burkina Faso", "Chad", "Djibouti", "Eritrea", "Eswatini", "Ethiopia", "Lesotho", "Malawi", "Mali", "Mauritania", 
       "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Somalia", "South Africa", "Sudan", "Tanzania", "Uganda", "Zimbabwe"]

fcover_loss_yearly = {"Ethiopia": -73, "Mozambique": -239.25, "Tanzania": -469, "Zambia": -188.21}

mapping = {a:-1 for a in all}

with open("ghi.csv", "r") as f:
    r = csv.reader(f)
    next(r)
    for row in r:
        print(row[0])
        if (row[0] in mapping):
            mapping[row[0]] = row[2]

    with open("ghi.json", "w") as outfile:
        json.dump(mapping, outfile)
