<script>
import axios from 'axios';
import {useStore} from "@/stores/searchQuestionnaireFuzzyResult"

export default {
  data() {
    return {
      identity: "true", // 管理員與否，預計 SessionStorage
      path: "", // 路徑,
      questionnaireList: [], // 問卷,
      pageTotal:1, // 頁數
      page:1, // 當前頁數
      
      
      findAll: import.meta.env.VITE_FIND_ALL,
     
    }
  },
  methods: {
    // 判斷問卷狀態
    getState(questionnaire) {
      const today = Date.now(); // 今天日期
      const startingTime = new Date(questionnaire.startingTime);
      const endTime = new Date(questionnaire.endTime);
      
      if (today < startingTime) {
        return "未開始";
      }
      else if (today > endTime) {
        return "已結束";
      }
      else {
        return "進行中";
      }
    },
    
    
    // 從 Pinia Store 更新問卷列表
    updateQuestionnaireList() {
      const store = useStore();
      this.questionnaireList = store.searchQuestionnaireFuzzyResult;
    },
    
    
    // 判斷點擊第幾頁
    pagination(element){
      this.page = element.target.innerText;
    }
  },
  async mounted() {
    // 取得所有問卷
    const response = await axios.get(this.findAll);
    this.questionnaireList = response.data.questionnaireList;
    console.log(this.questionnaireList);
    
    // 監聽 Pinia Store 的變化，並更新問卷列表
    const store = useStore();
    this.$watch(() => store.searchQuestionnaireFuzzyResult, this.updateQuestionnaireList);
    
    
    // 計算頁數
    const dataTotal = this.questionnaireList.length;
    const perPage = 10;
    this.pageTotal = Math.ceil(dataTotal / perPage);
  },
  computed: {
    // 管理員與否，決定路徑
    path() {
      return this.identity === "true" ? "/questionnaireManage" : "/fillQuestionnaire";
    }
  }
}
</script>

<template>
  <div class="overview-box">
    <span class="delete-Questionnaire" v-show="identity === 'true'">✖</span>
    <span class="add-Questionnaire" v-show="identity === 'true'">✚</span>
    <table>
      <thead>
      <tr>
        <th v-show="identity === 'true'">選取</th>
        <th>編號</th>
        <th>問卷名稱</th>
        <th>狀態</th>
        <th>開始時間</th>
        <th>結束時間</th>
        <th>查看結果</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(questionnaire,index) in questionnaireList && questionnaireList.slice(page * 9 - 9, page * 9)">
        <td v-show="identity === 'true'">
          <input :data-id="questionnaire.id" type="checkbox">
        </td>
        <td>{{ questionnaire.id }}</td>
        <td>
          <router-link :data-id="questionnaire.id" :to="path">{{ questionnaire.questionnaire }}</router-link>
        </td>
        <td v-text="getState(questionnaire)"></td>
        <td>{{ questionnaire.startingTime }}</td>
        <td>{{ questionnaire.endTime }}</td>
        <td>
          <router-link :data-id="questionnaire.id" to="/result">我是結果</router-link>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="page-item">
      <span v-for="page in pageTotal" v-on:click="pagination">{{ page }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overview-box{
  table{
    text-align: center;
  }
  
  .page-item{
    text-align: center;
  }
}

</style>