from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
cors = CORS(app, origins='*')

#Load the dataset
DATA_PATH= os.path.join("data", "DatasetAfricaMalaria.csv")
df = pd.read_csv(DATA_PATH)
print("Dataset loaded successfully.")

@app.route('/')
def home():
    return 'Flask API is running!'


@app.route('/data', methods=['GET'])
def get_filtered_data():
    # Get query parameters
    country = request.args.get('country')
    year = request.args.get('year', type=int)

    # Filter the DataFrame based on query parameters
    filtered_data = df.copy()
    if country and country != 'All':
        filtered_data = filtered_data[filtered_data['Country Name'] == country]
   
    if year:
        filtered_data = filtered_data[filtered_data['Year'] == year]

    # Convert the filtered DataFrame to a JSON format
    return jsonify(filtered_data.to_dict(orient='records'))

@app.route('/countries', methods=['GET'])
def get_countries():
    # Get unique countries from the DataFrame
    countries = df['Country Name'].unique().tolist()
    countries.insert(0, 'All')
    return jsonify(countries)

@app.route('/years', methods=['GET'])
def get_years():
    # Get unique years from the DataFrame
    years = df['Year'].unique().tolist()
    years.insert(0, 'All')
    return jsonify([int(y) if y != 'All' else y for y in years])

@app.route('/summary', methods=['GET'])
def get_summary():
    country = request.args.get('country')  
    year = request.args.get('year', type=int)

    filtered_data = df.copy()

    if country and country != 'All':
        filtered_data = filtered_data[filtered_data['Country Name'] == country]

    if year:
        filtered_data = filtered_data[filtered_data['Year'] == year]

    try:
        total_cases = int(filtered_data['Malaria cases reported'].sum())
    except KeyError:
        total_cases = 0

    try:
        total_incidence = int(filtered_data['Incidence of malaria (per 1,000 population at risk)'].sum())
    except KeyError:
        total_incidence = 0
    
    try:
        total_safe_sanitation = int(filtered_data['People using safely managed sanitation services (% of population)'].sum())
    except KeyError:
        total_safe_sanitation = 0
    
    try: 
        total_safe_water= int(filtered_data['People using safely managed drinking water services (% of population)'].sum())
    except KeyError:
        total_safe_water = 0


    return jsonify({
        "Total Cases": total_cases,
        "Total Incidences": total_incidence,
        "Total % using safe sanitation services": total_safe_sanitation,
        "Total % using safe water": total_safe_water
    })

@app.route('/top-countries', methods=['GET'])
def top_countries():
    year_param = request.args.get('year')

    # If year is not provided
    if not year_param:
        return jsonify({"error": "Year is required"}), 400

    # If year is 'All', show all years
    if year_param == 'All':
        df_filtered = df.copy()
    else:
        try:
            year = int(year_param)
            df_filtered = df[df['Year'] == year]
        except ValueError:
            return jsonify({"error": "Invalid year format"}), 400

    # Group by country and get top 10
    top_data = (
        df_filtered
        .groupby('Country Name')['Malaria cases reported']
        .sum()
        .sort_values(ascending=False)
        .head(10)
        .reset_index()
    )

    results = top_data.to_dict(orient='records')
    return jsonify(results)

@app.route('/malaria-trends', methods=['GET'])
def malaria_trends():
    year_param = request.args.get('year')

    # If year is not provided
    if not year_param:
        return jsonify({"error": "Year is required"}), 400

    # If year is 'All', show all years
    if year_param == 'All':
        df_filtered = df.copy()
    else:
        try:
            year = int(year_param)
            df_filtered = df[df['Year'] == year]
        except ValueError:
            return jsonify({"error": "Invalid year format"}), 400

    # Group by country and get top 10
    top_data = (
        df_filtered
        .groupby('Year')['Malaria cases reported']
        .sum()
        .sort_values(ascending=False)
        .head(10)
        .reset_index()
    )

    results = top_data.to_dict(orient='records')
    return jsonify(results)

@app.route('/metadata', methods=['GET'])
def get_metadata():
    countries =['All'] + sorted(df['Country Name'].unique().tolist())
    years = ['All'] + sorted([int(year) for year in df['Year'].unique().tolist()])
    return jsonify({"countries": countries, "years": years})

@app.route('/map-data' , methods=['GET'])
def get_map_data():
    year = request.args.get('year', type=int)
    filtered = df[df['Year'] == year]

    country_cases = filtered.groupby('Country Code')['Malaria cases reported'].sum().reset_index()
    country_cases.columns = ['country_code', 'cases']

    result = country_cases.to_dict(orient='records')
    return jsonify(result)

@app.route('/data')
def get_country_summary():
    country = request.args.get('country')
    start_year = int(request.args.get('startYear', 2007))
    end_year = int(request.args.get('endYear', 2017))

    filtered_df = df[
        (df['Country Name'] == country) &
        (df['Year'] >= start_year) &
        (df['Year'] <= end_year)
    ]

    return jsonify(filtered_df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)