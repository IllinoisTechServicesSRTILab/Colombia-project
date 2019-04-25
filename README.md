# Colombia-project
Soliman project using Twitter to track the spread of Zika irus in Colombia.

Geopandas documention: http://geopandas.org/index.html

Geopandas tutorial blog: https://www.datacamp.com/community/tutorials/geospatial-data-python

# Jatin's Work


## "analysis" Folder

1. Draw-Tweets.ipynb

Plots the tweets on the map.

2. Make-Fake-Tweets.ipynb

Makes the fake tweets csv in the "Data" folder.

3. The movement of the first 1000 rows is currently saved in analysis/fake_movement.png

Currently, the code maps (old_long, old_lat) to (new_long, new_lat). If you want it to map region to region, the best way to do that is to create a new csv that maps each region to a default longitude  and latitude, and then have another csv that shows a users movement from region to region (see the Data Visualization section for my approach on this). I imagine something like a column called "UserID," and then each region coming in pairs of columns that look something like "Region1_Longitude," "Region1_Latitude," then "Region2_Longitude" and "Region2_Latitude," and so on. This would give the plotting script all the information it needs to plot the movement, and with some modifications it could handle a csv of this fashion.

## "data" Folder
1. [Extended-Full]LatLong-tweet-test.csv

This took the original csv (LatLong-Tweet-Test.csv), added the randomly generated user movements, and provided a bunch of extra information, including the region number (as determined by the index in the Geopandas dataframe) and the year, month, day, hour, minute, and second parsed out of the column "created_at." It is essentially a columination of the information in most of the other csvs.

2. [Extended]LatLong-Tweet-Test.csv

This takes the LatLong-Tweet-Test.csv and parses the column "created_at" into individual constitutent time components. This is most handy for data visualization.

3. fake_tweets.csv

This randomly generated movements for each user in the original csv for the purpose of creating a plotting script.

4. LatLong-tweet-test.csv

This was the original csv of nearly 70,000 rows that contain real data Curt pulled from Twitter. All of my work starts with this csv.

5. movement_full.csv

A summary csv that shows the raw number of people moving from region 1 to region 2 in the fake dataset over the full timeframe.

## "dataViz" Folder

Creates a visualization of the spread of the Zika tweets in Columbia. To see the visualization, run

```
python -m http.server
```

in the main project folder. Note that this will only work with python3. The command will render the index.html file, which links to the visualization.js file.

1. [Day x]-tweets.csv

These twelve datasets are sliced from [Extended-Full]LatLong-tweet-test.csv by day. They make it easy for the visualization to pull the information relevant to each day.

2. d3-Extra-Analysis.ipynb

This file uses the day files and extracts some information that were better to provide to visualization.js as hard-coded numbers.

3. Make--Datasets.ipynb

The most important file. This created [Extended-Full]LatLong-tweet-test.csv and each of the day csv's used in the visualization.

4. movement.csv

This csv is the same as movement_full.csv in the "Data" folder except it only contains the top 20 location changes. The visualization used this to draw lines showing movement, but ultimately I decided that the code wasn't visually appealing and left it commented out in visualization.js.

5. region_to_region_index.json

A dictionary that was used to map a region name like "Bogota Bogota COL" to the index in the Geopandas dataframe.

6. region-to-centroid.csv

A csv that maps a region number (the index in the Geopandas dataframe) to a default longitude and latitude for the region. See Region-To-Centroid.ipynb to see how this was done.

7. Region-To-Centroid.ipynb

Script for obtaining the centroid's of each region for visualization purposes.

## "municipal_boundaries" Folder

Given by Curt, the most important file is the shapefile (.shp).

## Other Files

1. columbia.json

I used https://mapshaper.org, an amazing free mapping tool, to turn the given shapefile into what's called a GeoJSON. This json can be displayed by d3.js, but a shapefile cannot.

2. index.html

This file is called when you run the web server. It simply lays the scene for the visualization. It also makes a slider that is monitored by visualization.js to alter the day being shown.

3. main.css

A CSS style sheet that could be used in the future but at present there is no need. It is not referenced by index.html.

4. visualization.js

The bulk of the frontend visualization code lies here. It essentially loads columbia.json, displays it, and draws red circles around clusters of tweets for the current day.
