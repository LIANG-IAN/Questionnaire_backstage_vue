<script>

export default {
  data() {
    return {
      selectedIndex: 0,
        id:sessionStorage.getItem("id")
    }
  },
  methods: {
    // 頁標渲染
    selectTab(index) {
      this.selectedIndex = index;
    },
    
    
    // 跳轉頁面
    navigateTo(path) {
      this.$router.push(path);
    }
  },
    mounted() {
        const path = this.$route.path;
        switch (path) {
            case '/backstage/questionnaireManage':
                this.selectedIndex = 0;
                break
            case '/backstage/topic':
                this.selectedIndex = 1;
                break
            case '/backstage/feedback':
                this.selectedIndex = 2;
                break
            case '/backstage/statistics':
                this.selectedIndex = 3;
                break
            default:
                this.selectedIndex = 0;
                break
        }
    }
}
</script>

<template>
  <div class="backstage">
    <header>
      <span :class="{ 'render-gray': selectedIndex === 0 }"
            @click="navigateTo('/backstage/questionnaireManage'); selectTab(0)">問卷</span>
      <span :class="{ 'render-gray': selectedIndex === 1 }"
            @click="navigateTo('/backstage/topic'); selectTab(1)">問卷題目</span>
      <span :class="{ 'render-gray': selectedIndex === 2 }"
            @click="navigateTo('/backstage/feedback'); selectTab(2)" v-show="id !== null">問卷回饋</span>
      <span :class="{ 'render-gray': selectedIndex === 3 }"
            @click="navigateTo('/backstage/statistics'); selectTab(3)" v-show="id !== null">統計</span>
    </header>
    <div class="router-view">
      <RouterView/>
        <button type="button" class="roll-back" @click="navigateTo('/Overview')">回總覽</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.backstage {
    width: 800px;
    height: 100%;
    border-radius: 10px 10px 0 0;
    padding-top: 25px;
    color: white;
    
    header {
        width: 400px;
        height: 50px;
        display: flex;
        justify-content: space-between;
        background-color: grey;
        border-radius: 10px 10px 0 0;
        
        span {
            flex: 1;
            text-align: center;
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .render-gray {
            background-color: #2E4057;
        }
    }
    
    .router-view {
        flex-grow: 1;
        background-color: #2E4057;
        border-radius: 0 0 10px 10px;
        position: relative;
        
        .roll-back{
        position: fixed;
            right: 150px;
            bottom: 50px;
        }
    }
}
</style>