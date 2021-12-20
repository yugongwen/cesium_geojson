/* eslint-disable no-debugger */
<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>
    <el-dialog title="提示" :visible.sync='dialogVisible' width='30%' append-to-body :before-close="closed" :close-on-click-modal='false'>
      <span>{{data}}</span>
    </el-dialog>
  </div>
</template>

<script> 
// import baseData from '../../public/dataResource/dzglbz.geojson'

// import {default as proj4} from 'proj4';

export default {
  name: "", 
  data(){
    return{
      dialogVisible:false,
      data:'',
      // dataSrc:baseData
    }
  },
  methods:{
    // javascript 转换
      mercatorTolonlat(mercator){
          var lonlat={
            x:0,
            y:0
          };
          var x = mercator[0]/20037508.34*180;
          var y = mercator[1]/20037508.34*180;
          y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
          lonlat.x = x;
          lonlat.y = y;
          return lonlat;
      },
      closed(){
        console.log("1111")
        this.dialogVisible=false;
      },
      showData(item){
      console.log(item)
        this.dialogVisible=true;
        this.data=item.id.properties.LXMC;
        // console.log(data)
        return 
        
      }
    
  },
  mounted() {
    // var viewer = new Cesium.CesiumWidget('cesiumContainer')

    // eslint-disable-next-line no-undef
    var viewer = new Cesium.Viewer("cesiumContainer",{
      sceneMode: Cesium.SceneMode.SCENE3D,
      timeline:false,
      animation:false
    });
    var scene=viewer.scene;
    // 转换坐标
      // Cesium.GeoJsonDataSource.crsNames[
      //   "urn:ogc:def:crs:EPSG::3857"
      // ] = Cesium.GeoJsonDataSource.crsNames["EPSG:3857"] = function(
      //   coordinates
      // ) {
      //   const firstProjection =
      //     'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]';
      //   const secondProjection =
      //     'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';

      //   const xa = coordinates[0];
      //   const ya = coordinates[1];

      //   const newCoordinates = proj4(
      //     firstProjection,
      //     secondProjection,
      //     [xa, ya]
      //   );
      //   return Cesium.Cartesian3.fromDegrees(
      //     newCoordinates[0],
      //     newCoordinates[1],
      //     0
      //   );
      // };
      // var urlpath =  "../data/json/world.json"
      // $.get(urlpath, function (data) {
      //     const josnN = JSON.parse(data);
      //     const features = josnN.features;
      //     addDataToGlobe(features);
      // })
      let that=this;
      function addDataToGlobe(data){
        const instances = [];
        let cameraDes={};
        console.log(data);
        // for(let i=0; i<features.length; i++){
        // const polygonArr=[];
        //定义一个椭圆形
        // const ellipsoudGeometry = new Cesium.EllipsoudGeometry({
        //   vertexFormat:Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        //   radio:new Cesium.Cartesian3(1000.0,1000.0,1000.0)
        // })
            for(let j=0; j<data.features.length; j++){
              //3857 转4326
                // const polygonArr = features[i].geometry.coordinates[j].toString().split(',');
                let cordData=data.features[j];
                  const objData = that.mercatorTolonlat(cordData?.geometry?.coordinates);
                  cameraDes=objData;       
                  // console.log(cordData)
                  // debugger;
                  const polygon = new Cesium.CircleGeometry({
                      center :Cesium.Cartesian3.fromDegrees(objData?.x,objData?.y,0.0),
                      radius:500.0,
                      vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                  });
                     instances.push(new Cesium.GeometryInstance({
                      geometry : polygon,
                      id:cordData,
                      // content:objData,
                      attributes : {
                          color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({alpha : 1.0})),
                          // content:data[j]
                      },
                  }));
                  // console.log(polygon)
                  // polygonArr.push(polygon);
            }
            // console.log(instances);

            //       console.log(polygon);
            //       debugger
                  // const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
                  // instances.push(new Cesium.GeometryInstance({
                  //     geometry : polygonArr,
                  //     attributes : {
                  //         color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({alpha : 0.7})),
                  //     },
                  // }));
            // console.log(instances);

           
        // }
        
        const primitive = new Cesium.Primitive({
            geometryInstances : instances,
            appearance :  new Cesium.PerInstanceColorAppearance({ // 为每个instance着色
                translucent : true,
                closed : false
            }),
            asynchronous : false,  // 确定基元是异步创建还是阻塞直到准备就绪
        });
        
        scene.primitives.add(primitive);
        //获取屏幕坐标 对应展示相应信息
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function(movement){
            console.log(movement)
            //  debuggger;
          var pick = scene.pick(movement.position);
          if(Cesium.defined(pick)){
            console.log(pick)
            console.log("hahha")
            that.showData(pick)
            // that.dialogVisible=true;
            // debugger;
          }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)

        viewer.camera.flyTo({
         destination:Cesium.Cartesian3.fromDegrees(cameraDes.x,cameraDes.y,200000),
         })
      }

    // var dataSource = Cesium.GeoJsonDataSource.load(
    //      '/dataResource/dzglbz.geojson'
    //     );
    // viewer.dataSources.add(dataSource);
  this.$axios.get('/dataResource/dzglbz.geojson').then(resData=>{
    console.log(resData);
    //  const josnN = JSON.parse(resData.data);
      // const features = resData.data.features;
      const data = resData.data;
      addDataToGlobe(data);
    // debugger;
  })
    // viewer.zoomTo(scene);

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
