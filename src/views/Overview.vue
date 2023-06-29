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
        <OverviewBox/>
    </div>
</template>

<style lang="scss" scoped>
.overview {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100vh;
    width: 100%;
    
}
</style>