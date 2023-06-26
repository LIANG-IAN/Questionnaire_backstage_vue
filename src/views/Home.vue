<script>

export default {
  methods:{
    identity(num){
      if (num === 0){
        sessionStorage.setItem("identity","false");
      }
      else {
        sessionStorage.setItem("identity","true");
      }
      this.$router.push("/Overview")
    }
  }
}
</script>

<template>
<div class="home">
  <button @click="identity(0)">使用者</button>
  <button @click="identity(1)">管理員</button>
</div>
</template>

<style scoped lang="scss">

</style>