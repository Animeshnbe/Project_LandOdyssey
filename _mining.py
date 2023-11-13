import csv

def converter(val,unit):
    if (unit.strip()==""):
        print("Error ",val)
        return val
    elif (unit=="ounce"):
        return val/35.274
    elif (unit=="tons"):
        return val*1000
    elif (unit=="carat"):
        return val/5000
    elif (unit=="lb"):
        return val*0.453592
    elif (unit=="grams"):
        return val/1000
    return val

selected = ["Name", "Country", "Commodity", "Current Production", "Current Production Unit", "Project Inception (Year)", "Energy Consumption (kwh/t product)", "Mine Location"]
selected_rows = []
with open('raw_data/mining_raw.csv', 'r', newline='', encoding='utf-8') as f:
    csv_reader = csv.reader(f)
    header = next(csv_reader)
    # print(header)
    selected_indices = [header.index(col) for col in selected]
    print(selected_indices)
    i = 1
    for row in csv_reader:
        try:
            if row[header.index("Status")] == "Producer" and row[header.index("Current Production")] != "":
                selected_data = [row[i] for i in selected_indices]
                selected_rows.append(selected_data)
            # break
            i+=1
        except UnicodeDecodeError:
            print(i)

print(len(selected_rows))

for row in selected_rows:
    row[3] = converter(float(row[3]),row[4])
    # row[4] = "Kgs"
    if row[1].startswith("Congo"):
        row[1] = "Congo"
    del row[4]
    row[0], row[1] = row[1], row[0]


# unique_values = set()
# for row in selected_rows:
#     if row[3].strip()=="":
#         print(row[1]+"_"+row[0])
#     unique_values.add(row[1]+"_"+row[0])

# print(len(sorted(unique_values)))

################### TOTALING PER COUNTRY #################
sorted_rows = sorted(selected_rows, key=lambda x: (x[0], -x[3]))
grouped = {}
for row in sorted_rows:
    if column0_value in grouped:
        grouped[row[0]] += row[3]
    else:
        grouped[row[0]] = row[3]

# header = ["name", "country", "commodity", "production", "inception_year", "energy_consumption", "location"]
# with open('raw_data/mining.csv', 'w', newline='') as f:
#     csv_writer = csv.writer(f)
#     csv_writer.writerow(header)
#     sorted_rows = sorted(selected_rows, key=lambda x: (x[0], -x[3]))
#     csv_writer.writerows(sorted_rows)