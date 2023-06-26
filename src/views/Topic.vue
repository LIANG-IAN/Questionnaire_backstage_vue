<script>

export default {
  data() {
    return {
      inputType: "text",
      optionAmount: [1],
      questionAmount: [1],
    }
  },
  methods: {
    plus(item) {
      item = item || 0;  // 將 item 初始化為 0，如果它是 undefined
      item++;
      return item;
    },
    minus(item) {
      item = item || 0;
      item--;
      if (item <=0){
        return item = 1; // 避免 input 完全消失
      }
      return item;
    }
  }
}
</script>

<template>
  <div class="topic">
    <div v-for="(n,index) in questionAmount" :key="index" class="question-block">
      
      <label :for="'question-' + index">問題</label>
      <input :id="`question-` + index" type="text">
      
      <div class="option-block">
        <label for="answer">回答</label>
        <span @click="optionAmount[index] = plus(optionAmount[index])">＋</span>
        <span @click="optionAmount[index] = minus(optionAmount[index])">－</span>
        <input v-for=" (n,index) in optionAmount[index]" :key="index" type="text">
      </div>
      
      <select v-model="inputType">
        <option value="text">
          簡答
        </option>
        <option value="select">
          選擇題
        </option>
        <option value="checkbox">
          核取方塊
        </option>
      </select>
    
    </div>
    <span @click="questionAmount = plus(questionAmount)">＋</span>
    <span @click="questionAmount = minus(questionAmount)">－</span>
  </div>
</template>

<style lang="scss" scoped>
.topic {
  
  .question-block {
  
  }
}
</style>