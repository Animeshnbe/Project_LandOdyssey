import csv
# import json
from matplotlib import pyplot as plt
import numpy as np
import os
from sklearn.preprocessing import MinMaxScaler
import json

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

def scale(ydata):
    scaler = MinMaxScaler()
    y_values_scaled = scaler.fit_transform(np.array(ydata).reshape(-1, 1))

    y_values_scaled = y_values_scaled.flatten()
    return y_values_scaled

ys = {"ghi","mort","hdi","conflict-and-terror"}
xs = {"ghg","degraded"}

names = {"ghi":"Hunger Index",
            "mort":"Mortality",
            "infm":"Infant Mortality",
            "hdi":"Human Development Index",
            "hci":"Human Capital Index",
            "health_access":"Healthcare access/quality",
            "conflict-and-terror":"Conflict and terror",
            "deforestation":"Deforestation","cropland-area":"Cropland area","farea":"Forest area",
            "degraded":"Share of Degraded land",
            "ghg":"Greenhouse emissions","gold-prod":"Gold production"}

corrs = {}
for country in all:
    for x in xs:
        env_data = compile_data(x+'.csv')
        for y in ys:
            im_data = compile_data(y+'.csv')
            y_series = im_data[country] 
            x_series = env_data[country]

            if len(y_series)<3 or len(x_series)<3:
                continue

            y_data = list(y_series.values())
            x_data = list(x_series.values())

            common_years = set(im_data[country].keys()) & set(env_data[country].keys())
            if len(common_years)>1:
                x_common = scale([env_data[country][year] for year in common_years])
                y_common = scale([im_data[country][year] for year in common_years])
                
                corr = np.corrcoef(x_common, y_common)[0,1]
                if abs(corr) > 0.5:
                    # print(country+": "+x+"_"+y)
                    # print(corr)
                    corrs[country+"_"+x+"_"+y] = corr

                plt.plot(y_series.keys(), scale(y_data), label=names[y])
                plt.plot(x_series.keys(), scale(x_data), label=names[x])

                plt.title(country)
                plt.ylabel('Normalised Index')
                plt.legend()
                plt.xlabel("Year")
                if not os.path.exists('plots/'+country):
                    os.makedirs('plots/'+country)
                # plt.show()
                plt.savefig("plots/"+country+"/"+y+"_"+x+".png")
                plt.clf()
    # break

# with open("plot_relation.json", "w") as outfile:
#     json.dump(corrs, outfile)


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