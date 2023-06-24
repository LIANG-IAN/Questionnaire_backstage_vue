<script>
import SearchBox from "@/components/SearchBox.vue";
import OverviewBox from "@/components/OverviewBox.vue";


export default {
  components: {OverviewBox, SearchBox}
}
</script>

<template>
  <div class="overview">
    <SearchBox/>
    <overview-box/>
  </div>
</template>

<style scoped lang="scss">

</style>