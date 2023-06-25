<script>
import axios from 'axios';
import {useStore} from "@/stores/searchQuestionnaireFuzzyResult"

export default {
  data() {
    return {
      identity: "true", // 管理員與否，預計 SessionStorage
      path: "", // 路徑,
      questionnaireList: [], // 問卷,
      pageTotal: 1, // 頁數
      page: 1, // 當前頁數
      checkedList: [], // 被勾選問卷
      isChecked: false,
      
      
      findAll: import.meta.env.VITE_FIND_ALL,
      deleteQuestionnaire:import.meta.env.VITE_DELETE_QUESTIONNAIRE
      
    }
  },
  methods: {
    // 判斷問卷狀態
    getState(questionnaire) {
      const today = Date.now(); // 今天日期
      const startingTime = new Date(questionnaire.startingTime);
      const endTime = new Date(questionnaire.endTime);
      
      if (today < startingTime) {
        return "尚未開始";
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
    pagination(element) {
      this.page = element.target.innerText;
    },
    
    
    // 勾選
    check(questionnaireId) {
      if (this.checkedList.includes(questionnaireId)) {
        const index = this.checkedList.indexOf(questionnaireId);
        this.checkedList.splice(index, 1);
      }else {
        this.checkedList.push(questionnaireId);
      }
    },
    
    
    deleteQuestion(questionnaireIdList){
      axios.post(this.deleteQuestionnaire,{"idList":questionnaireIdList}).then(response=>{
        alert(response.data.message);
      })
    }
  },
  async mounted() {
    // 取得所有問卷
    const response = await axios.get(this.findAll);
    this.questionnaireList = response.data.questionnaireList;
    
    
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
    },
    
  }
}
</script>

<template>
  <div class="overview-box">
    <span v-show="identity === 'true'" @click="deleteQuestion(checkedList)" class="delete-Questionnaire">✖</span>
    <span v-show="identity === 'true'" class="add-Questionnaire">✚</span>
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
      <tr v-for="questionnaire in questionnaireList && questionnaireList.slice(page * 10 - 10, page * 10)">
        <td v-show="identity === 'true'">
          <input :checked="isChecked" :data-id="questionnaire.id" type="checkbox" @click="check(questionnaire.id)">
        </td>
        <td>{{ questionnaire.id }}</td>
        
        
        <!--   是否渲染 router-link   -->
        <td v-if="getState(questionnaire) === '進行中'">
          <router-link :data-id="questionnaire.id" :to="path">{{ questionnaire.questionnaire }}</router-link>
        </td>
        <td v-else-if="identity === 'true'">
          <router-link :data-id="questionnaire.id" :to="path">{{ questionnaire.questionnaire }}</router-link>
        </td>
        <td v-else>{{ questionnaire.questionnaire }}</td>
        
        
        <td v-text="getState(questionnaire)"></td>
        <td>{{ questionnaire.startingTime }}</td>
        <td>{{ questionnaire.endTime }}</td>
        
        
        <!--   是否渲染 router-link   -->
        <td v-if="getState(questionnaire) !== '尚未開始'">
          <router-link :data-id="questionnaire.id" to="/result">我是結果</router-link>
        </td>
        <td v-else>我是結果</td>
      
      </tr>
      </tbody>
    </table>
    <div class="page-item">
      <span v-for="page in pageTotal" v-on:click="pagination">{{ page }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overview-box {
  table {
    text-align: center;
  }
  
  .page-item {
    text-align: center;
  }
}

</style>