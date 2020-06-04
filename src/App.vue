
<template>
  <div id="app">
    <Layout>
      <Header class="app-header">
        <router-link :to="{name: 'GeneralPanel'}">
          <Button
            type="primary"
            shape="circle"
            icon="md-home"
            size="large"
          />
        </router-link>
        <h3 class="title">{{ $store.state.title }}</h3>
        <router-link :to="{name: 'ValidationList'}">
          <Button
            type="primary"
            shape="circle"
            icon="md-list"
            size="large"
          >List</Button>
        </router-link>
      </Header>

      <Content class="app-content">
        <router-view/>
      </Content>

      <Footer></Footer>
    </Layout>
  </div>
</template>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #808695;
}
.title {
  color: white;
  font-size: 20px;
}
.app-content {
  min-height: calc(100vh - 64px - 50px);
}
.app-header {
  display: flex;
  justify-content: space-between;
  font-size: 40px;
  text-decoration: none;
  color: white;

  a {
    font-weight: bold;
    color: white;
  }
}
</style>
