<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand">Authenticator</router-link>
    <div class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link to="/loginUser" class="nav-link">Sign-In</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/add" class="nav-link">Sign-Up</router-link>
      </li>
    </div>
  </nav>
  <div class="container mt-3">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    components: {
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
