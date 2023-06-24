<script>

export default {
  data(){
    return{
      questionnaireName:"",
      startingTime:"",
      endTime:"",
    }
  }
}
</script>

<template>
  <div class="search-box">
    <div class="title-search">
      <span>問卷名稱</span>
      <input type="text" v-model.trim="questionnaireName">
      <p>{{questionnaireName}}</p>
    </div>
    <div class="time-search">
      <span>開始  /  結束</span>
      <input type="date" v-model="startingTime">
      <input type="date" v-model="endTime">
      <p>{{startingTime}}</p>
      <p>{{endTime}}</p>
    </div>
    <button>送出</button>
  </div>
</template>

<style lang="scss" scoped>
.search-box{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>