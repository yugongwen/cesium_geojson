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
      // var urlpath =  "../data/json/world.json"
      // $.get(urlpath, function (data) {
      //     const josnN = JSON.parse(data);
      //     const features = josnN.features;
      //     addDataToGlobe(features);
      // })
      function addDataToGlobe(features){
        const instances = [];
        for(let i=0; i<features.length; i++){
            for(let j=0; j<features[i].geometry.coordinates.length; j++){
                const polygonArr = features[i].geometry.coordinates[j].toString().split(',');
                const polygon = new Cesium.PolygonGeometry({
                    polygonHierarchy : new Cesium.PolygonHierarchy(
                        Cesium.Cartesian3.fromDegreesArray(polygonArr)
                    ),
                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                });
                const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
                instances.push(new Cesium.GeometryInstance({
                    geometry : geometry,
                    attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({alpha : 0.7})),
                    },
                }));
            }
        }
        
        const primitive = new Cesium.Primitive({
            geometryInstances : instances,
            appearance :  new Cesium.PerInstanceColorAppearance({ // 为每个instance着色
                translucent : true,
                closed : false
            }),
            asynchronous : false,  // 确定基元是异步创建还是阻塞直到准备就绪
        });
        
        scene.primitives.add(primitive);
      }

    // var dataSource = Cesium.GeoJsonDataSource.load(
    //      '/dataResource/dzglbz.geojson'
    //     );
    // viewer.dataSources.add(dataSource);
  this.$axios.get('/dataResource/dzglbz.geojson').then(resData=>{
    console.log(resData);
    //  const josnN = JSON.parse(resData.data);
      const features = resData.data.features;
      addDataToGlobe(features);
    // debugger;
  })

        // viewer.zoomTo(dataSource);
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
