# Colombia-project
Soliman project using Twitter to track the spread of Zika irus in Colombia.

Geopandas documention: http://geopandas.org/index.html

Geopandas tutorial blog: https://www.datacamp.com/community/tutorials/geospatial-data-python

# Jatin's Work

Go to "Draw-Tweets.ipynb" to see how to plot tweets on the map.
Go to "Make-Fake-Tweets.ipynb" to see how the fake tweets csv was made.

Currently, the code maps (old_long, old_lat) to (new_long, new_lat). If you want it to map region to region, have a csv that maps location to longitude and latitude. Then, in the plotting script, pull the location, feed it to the map, and use the map's longitude and latitude for that region.

The movement of the first 1000 rows is currently saved in fake_movement.png
