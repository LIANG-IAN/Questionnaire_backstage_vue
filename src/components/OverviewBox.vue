<script>
import axios from 'axios';

export default {
  data() {
    return {
      identity: "true", //管理員與否，預計sessionStorage
      path: "", //路徑,
      questionnaireList: {}, //問卷
      today: Date.now(), //今天日期
      
      
      findAllUrl: import.meta.env.VITE_FIND_ALL,
    }
  },
  methods: {
    getState(questionnaire) {
      const startingTime = new Date(questionnaire.startingTime);
      const endTime = new Date(questionnaire.endTime);
      
      if (this.today < startingTime) {
        return "未開始";
      } else if (this.today > endTime) {
        return "已結束";
      } else {
        return "進行中";
      }
    }
  },
  mounted() {
    // 取得所有問卷
    axios.get(this.findAllUrl).then(res => {
      this.questionnaireList = res.data.questionnaireList;
      console.log(this.questionnaireList);
    })
  },
  computed: {
    path() {
      // 管理員與否，決定路徑
      return this.identity === "true" ? "/questionnaireManage" : "/fillQuestionnaire";
    }
  }
}
</script>

<template>
  <div class="overview-box">
    <table>
      <thead>
      <tr>
        <th>選取</th>
        <th>編號</th>
        <th>問卷名稱</th>
        <th>狀態</th>
        <th>開始時間</th>
        <th>結束時間</th>
        <th>查看結果</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(questionnaire,index) in questionnaireList">
        <td>
          <input :data-id="questionnaire.id" type="checkbox">{{ questionnaire.id }}
        </td>
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
  </div>
</template>

<style lang="scss" scoped>

</style>