import json
import csv

json_data = []
with open('mining.csv', 'r', newline='', encoding='utf-8') as f:
    csv_reader = csv.DictReader(f)
    json_data = [row for row in csv_reader]

# print(json_data)
with open('./africa_mines.json', 'w') as json_file:
    json.dump(json_data, json_file)