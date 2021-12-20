/* eslint-disable no-debugger */
<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script> 
// import baseData from '../../public/dataResource/dzglbz.geojson'

import {default as proj4} from 'proj4';

export default {
  name: "", 
  data(){
    return{
      // dataSrc:baseData
    }
  },
  mounted() {
    // var viewer = new Cesium.CesiumWidget('cesiumContainer')

    // eslint-disable-next-line no-undef
    var viewer = new Cesium.Viewer("cesiumContainer",{
      sceneMode: Cesium.SceneMode.SCENE2D,
      timeline:false,
      animation:false
    });
    // 转换坐标
              Cesium.GeoJsonDataSource.crsNames[
                "urn:ogc:def:crs:EPSG::3857"
              ] = Cesium.GeoJsonDataSource.crsNames["EPSG:3857"] = function(
                coordinates
              ) {
                const firstProjection =
                  'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]';
                const secondProjection =
                  'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
 
                const xa = coordinates[0];
                const ya = coordinates[1];
 
                const newCoordinates = proj4(
                  firstProjection,
                  secondProjection,
                  [xa, ya]
                );
                return Cesium.Cartesian3.fromDegrees(
                  newCoordinates[0],
                  newCoordinates[1],
                  0
                );
              };

    var dataSource = Cesium.GeoJsonDataSource.load(
         '/dataResource/dzglbz.geojson'
        );
    var promise= viewer.dataSources.add(dataSource);
    promise.then((dataSource)=>{
      viewer.dataSource.add(dataSource);
      var geocacheEntities= dataSource.entities.values;
      for(let i=0;i<geocacheEntities.length;i++){
        var entity =geocacheEntities[i]
        console.log(entity)
        // debugger
        // Add geocache billboard entities to scene and style them
            if (Cesium.defined(entity.billboard)) {
              // Adjust the vertical origin so pins sit on terrain
              entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
              // Disable the labels to reduce clutter
              entity.label = undefined;
              // Add distance display condition
              entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);
              // Compute longitude and latitude in degrees
              var cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
              var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
              var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
              // Modify description
              // Modify description
              var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>' +
                '<tr><th>' + "Longitude" + '</th><td>' + longitude.toFixed(5) + '</td></tr>' +
                '<tr><th>' + "Latitude" + '</th><td>' + latitude.toFixed(5) + '</td></tr>' +
                '</tbody></table>';
              entity.description = description;
            }
      }
    })
        viewer.zoomTo(dataSource);
    // eslint-disable-next-line no-console
    console.log(viewer)
  }
};
</script> 
<style scoped>
  .map-box{
    width: 100%;
    height: 100%;
  }
  #cesiumContainer{
    width: 100%;
    height: 100%;
  }
</style>
