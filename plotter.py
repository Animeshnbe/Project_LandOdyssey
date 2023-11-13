import json
import csv

# countries = ["Ethiopia", "Ghana", "Mozambique", "Namibia", "South Africa", "Tanzania", "Uganda"]
cat = {"sa": ["Eswatini", "Lesotho", "Namibia", "South Africa", "Zimbabwe"], 
    "sahel": ["Cameroon", "Chad", "Ethiopia", "Eritrea", "Mali", "Mauritania", "Niger", "Nigeria", "Senegal", "Sudan"],
    "horn": ["Ethiopia", "Eritrea", "Djibouti", "Somalia"],
    "glakes": ["Malawi", "Rwanda", "Tanzania", "Uganda"]}

all = ["Cameroon", "Chad", "Congo", "Djibouti", "Eritrea", "Eswatini", "Ethiopia", "Lesotho", "Malawi", "Mali", "Mauritania", 
       "Namibia", "Niger", "Nigeria", "Rwanda", "Senegal", "Somalia", "South Africa", "Sudan", "Tanzania", "Uganda", "Zimbabwe"]

x_params = ["farea","cropland","ghg","deforest"]
y_params = ["hci","hdi","ghi","mortality","infant_mortality"]
cols = x_params+y_params
# print(cols)

data = {a:[-1. for _ in range(9)] for a in all}
for i,col in enumerate(cols):
    with open(col+".json", "r") as f:
        x = json.load(f)
        for k,v in x.items():
            data[k][i] = abs(float(v))
        
print(data["Botswana"])


import numpy as np
from sklearn.preprocessing import MinMaxScaler

column_data = [[] for _ in range(9)]

for key in data:
    values = data[key]
    for i, value in enumerate(values):
        if value != -1:
            column_data[i].append(value)

column_means = [np.mean(column) if column else 0 for column in column_data]

print(column_means)
for key in data:
    values = data[key]
    for i, value in enumerate(values):
        if value == -1:
            values[i] = column_means[i]

proc_data = []
for k,v in data.items():
    proc_data.append(np.array(v))

proc_data = np.array(proc_data)
min_val = np.min(proc_data, axis=0, keepdims=True)
max_val = np.max(proc_data, axis=0, keepdims=True)
# row_means = np.mean(proc_data, axis=1, keepdims=True)
# row_stddevs = np.std(proc_data, axis=1, keepdims=True)

std_data = (proc_data - min_val) / (max_val-min_val)


from matplotlib import pyplot as plt

x_param = 1
sorted_indices = np.argsort(std_data[:, x_param])
sorted_data = std_data[sorted_indices]
x = sorted_data[:, x_param]

y = sorted_data[:, 4:9]

plt.figure(figsize=(10, 6))  # Adjust the figure size as needed

for i in range(5):
    plt.plot(x, y[:, i], label=y_params[i])

plt.xlabel(x_params[x_param])
plt.ylabel('Population indicators')
plt.title('Multiple Line Plots')
plt.legend()
plt.grid(True)
plt.show()





