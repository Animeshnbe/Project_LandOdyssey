# import json
# import csv

# # countries = ["Ethiopia", "Ghana", "Mozambique", "Namibia", "South Africa", "Tanzania", "Uganda"]
# cat = {"sa": ["Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa", "Zimbabwe"], 
#     "sahel": ["Burkina Faso", "Chad", "Ethiopia", "Eritrea", "Mali", "Mauritania", "Niger", "Nigeria", "Senegal", "Sudan"],
#     "horn": ["Ethiopia", "Eritrea", "Djibouti", "Somalia"],
#     "glakes": ["Malawi", "Rwanda", "Tanzania", "Uganda"]}

# all = ["Botswana", "Burkina Faso", "Chad", "Djibouti", "Eritrea", "Eswatini", "Ethiopia", "Lesotho", "Malawi", "Mali", "Mauritania", 
#        "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Somalia", "South Africa", "Sudan", "Tanzania", "Uganda", "Zimbabwe"]

# fcover_loss_yearly = {"Ethiopia": -73, "Mozambique": -239.25, "Tanzania": -469, "Zambia": -188.21}

# mapping = {a:-1 for a in all}

# with open("ghi.csv", "r") as f:
#     r = csv.reader(f)
#     next(r)
#     for row in r:
#         print(row[0])
#         if (row[0] in mapping):
#             mapping[row[0]] = row[2]

#     with open("ghi.json", "w") as outfile:
#         json.dump(mapping, outfile)


import csv
import json


all = ["Botswana", "Burkina Faso", "Chad", "Djibouti", "Eritrea", "Eswatini", "Ethiopia", "Lesotho", "Malawi", "Mali", "Mauritania", 
       "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Somalia", "South Africa", "Sudan", "Tanzania", "Uganda", "Zimbabwe"]

def compile_data(filename):
    data = {}
    with open('raw_data/'+filename, 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        
        next(csvreader)
        
        for row in csvreader:
            entity, _, year, im = row
            if len(im)==0:
                continue
            year = int(year)
            im = float(im)
            
            if entity in data:
                if year > data[entity]['Year']:
                    data[entity] = {'Year': year, 'Value': im}
            else:
                data[entity] = {'Year': year, 'Value': im}
    
    return data

im_data = compile_data('hdi.csv')
values = {entity: data['Value'] for entity, data in im_data.items() if entity in all}

print(values)
with open("hdi.json", "w") as outfile:
    json.dump(values, outfile)