import sys
import pandas as pd
import json
import os

file_path = 'Libro.xlsx'
if not os.path.exists(file_path):
    with open('excel_data.json', 'w', encoding='utf-8') as f:
        json.dump({"error": "File not found"}, f)
    sys.exit(1)

try:
    df = pd.read_excel(file_path, engine='openpyxl')
    # Filter out complete NaN rows to make it cleaner
    df.dropna(how='all', inplace=True)
    records = df.to_dict('records')
    with open('excel_data.json', 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
except Exception as e:
    with open('excel_data.json', 'w', encoding='utf-8') as f:
        json.dump({"error": str(e)}, f)
