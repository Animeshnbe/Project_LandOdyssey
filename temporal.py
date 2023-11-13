import csv
# import json


all = ["Cameroon", "Chad", "Congo", "Djibouti", "Eritrea", "Eswatini", "Ethiopia", "Lesotho", "Malawi", "Mali", "Mauritania", 
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

ys = {"ghi","mort","infm","hdi","hci","health_access"}
xs = {"deformation","cropland-area","farea","ghg","mining-c"}
im_data = compile_data('mort.csv')
env_data = compile_data('ghg.csv')
# # print(im_data)
# country = "Ethiopia"
# common_years = set(im_data[country].keys()) & set(env_data[country].keys())

# y_series = im_data[country]
# # x_series = {year: env_data[country][year] for year in common_years}
# x_series = env_data[country]

from matplotlib import pyplot as plt
import numpy as np
from sklearn.preprocessing import MinMaxScaler

def scale(ydata):
    scaler = MinMaxScaler()
    y_values_scaled = scaler.fit_transform(np.array(ydata).reshape(-1, 1))

    y_values_scaled = y_values_scaled.flatten()
    return y_values_scaled

# plt.figure(figsize=(10, 6))
# plt.plot(y_series.keys(), scale(list(y_series.values())), label="Hunger")
# plt.plot(x_series.keys(), scale(list(x_series.values())), label="Deforestation")
# plt.xlabel("Year")
# plt.ylabel('National Index')
# plt.title(country)
# plt.legend()
# plt.grid(True)
# plt.show()

for country in all:
    y_series = im_data[country] 
    x_series = env_data[country]
    if len(y_series)>0:
        plt.plot(y_series.keys(), scale(list(y_series.values())), label="Mortality")
    if (len(x_series)>0):
        plt.plot(x_series.keys(), scale(list(x_series.values())), label="Emissions")

    plt.title(country)
    plt.ylabel('National Index')
    plt.legend()
    plt.xlabel("Year")
    plt.savefig(+"/"country+".png")

# countries = all[1:9]
# print(countries)
# print(len(countries))
# fig, axes = plt.subplots(len(countries)//3+1, 3, figsize=(10, 6*len(countries)), sharex=True)

# plt.subplots_adjust(hspace=0.5)

# for i, country in enumerate(countries):
#     y_series = im_data[country] 
#     x_series = env_data[country]

#     # print("Len ",country,len(y_series),len(x_series))
#     if (len(y_series)>0):
#         axes[i//3,i%3].plot(y_series.keys(), scale(list(y_series.values())), label="Emissions")
#     if (len(x_series)>0):
#         axes[i//3,i%3].plot(x_series.keys(), scale(list(x_series.values())), label="Deforestation")

#     axes[i//3,i%3].set_title(country)
#     axes[i//3,i%3].set_ylabel('National Index')
#     # axes[i].grid(True)
#     axes[i//3,i%3].legend()

# plt.xlabel("Year")
# plt.tight_layout()

# plt.show()