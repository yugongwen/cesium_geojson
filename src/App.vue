<template>
  <div id="app">
    <cesium-home></cesium-home>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import CesiumHome from './components/CesiumHome.vue'
export default {
  name: 'App',
  components: {
    // HelloWorld
    CesiumHome
  }
}
</script>

<style>
html,body {
  width:100%;
  height: 100%;
  padding:0;
  margin:0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width:100%;
  height: 100%;
}
</style>
