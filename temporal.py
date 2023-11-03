import csv
import json


all = ["Botswana", "Burkina Faso", "Chad", "Djibouti", "Eritrea", "Eswatini", "Ethiopia", "Lesotho", "Malawi", "Mali", "Mauritania", 
       "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Somalia", "South Africa", "Sudan", "Tanzania", "Uganda", "Zimbabwe"]

def compile_data(filename):
    data = {e:{} for e in all}
    with open('raw_data/'+filename, 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        
        next(csvreader)
        
        for row in csvreader:
            entity = row[0]
            if len(row[3])==0:
                continue
            year = int(row[2])
            im = float(row[3])
            
            if entity in all:
                data[entity].update({year: im})
    
    return data


im_data = compile_data('global-hunger-index.csv')
env_data = compile_data('annual-deforestation.csv')
# print(im_data)
country = "Ethiopia"
common_years = set(im_data[country].keys()) & set(env_data[country].keys())

y_series = im_data[country]
x_series = {year: env_data[country][year] for year in common_years}

from matplotlib import pyplot as plt
import numpy as np
from sklearn.preprocessing import MinMaxScaler

def scale(ydata):
    scaler = MinMaxScaler()
    y_values_scaled = scaler.fit_transform(np.array(ydata).reshape(-1, 1))

    y_values_scaled = y_values_scaled.flatten()
    return y_values_scaled

plt.figure(figsize=(10, 6))


plt.plot(y_series.keys(), scale(list(y_series.values())), label="Hunger")
print(scale(list(x_series.values())))
plt.plot(x_series.keys(), scale(list(x_series.values())), label="Deforestation")
plt.xlabel("Year")
plt.ylabel('National Index for '+country)
# plt.title('')
plt.legend()
plt.grid(True)
plt.show()
# with open("hdi.json", "w") as outfile:
#     json.dump(im_data, outfile)