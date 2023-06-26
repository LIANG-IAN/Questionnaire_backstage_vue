<script>

export default {
  data() {
    return {
      inputType: ["text"],
      questionAmount: 1,
    }
  },
  methods: {
    plus(item) {
      item++;
      return item;
    },
    
    
    minus(item) {
      item--;
      if (item <= 0) {
        return item = 1;
      }
      return item;
    },
    
    
    // 僅使用在 Watch
    getChangedIndex(newArray, oldArray) {
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] !== oldArray[i]) {
          return i;
        }
      }
      return -1;
    }
  },
  watch: {}
}
</script>

<template>
  <div class="topic">
    <div v-for="(n,index) in questionAmount" :key="index" class="question-block">
      
      <label :for="'question-' + index">問題</label>
      <input :id="`question-` + index" type="text">
      
      <div class="option-block">
        <label for="answer">回答</label>
        <input type="text">
      </div>
      
      <select v-model="inputType[index]">
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
    <div class="symbol">
      <span @click="questionAmount = plus(questionAmount)">＋</span>
      <span @click="questionAmount = minus(questionAmount)">－</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.topic {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .question-block {
  
  }
}
</style>