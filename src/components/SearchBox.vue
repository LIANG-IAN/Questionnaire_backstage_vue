<script>
import axios from 'axios';
import {useStore} from "@/stores/searchQuestionnaireFuzzyResult"

export default {
    data() {
        return {
            questionnaireName: "", // 模糊搜尋關鍵字
            startingTime: "", // 開始時間
            endTime: "", // 結束時間
            questionnaireList: [], // 問卷
            
            
            findAll: import.meta.env.VITE_FIND_ALL,
            findByQuestionnaireFuzzySearch: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_FUZZY_SEARCH,
            viteFindByStartingTime: import.meta.env.VITE_FIND_BY_STARTING_TIME,
            viteFindByEndTime: import.meta.env.VITE_FIND_BY_END_TIME,
            viteFindByStartingTimeBetween: import.meta.env.VITE_FIND_BY_STARTING_TIME_BETWEEN
        }
    },
    methods: {
        // 模糊搜尋問卷
        searchQuestionnaireFuzzy(name, startingTime, endTime) {
            // TODO
            // name 有值，優先搜尋
            if (name && name.trim() !== "") {
                axios.post(this.findByQuestionnaireFuzzySearch, {"questionnaire": name}).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (startingTime !== "" && endTime === "") {
                axios.post(this.viteFindByStartingTime, {"startingTime": startingTime}).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (startingTime === "" && endTime !== "") {
                axios.post(this.viteFindByEndTime, {"endTime": endTime}).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (startingTime !== "" && endTime !== "") {
                axios.post(this.viteFindByStartingTimeBetween, {
                    "startingTime": startingTime,
                    "endTime": endTime
                }).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else {
                axios.get(this.findAll).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                });
            }
        }
    },
    watch: {
        questionnaireList(newValue) {
            const store = useStore();
            store.setQuestionnaireFuzzyResult(newValue);
        }
    }
}
</script>

<template>
    <div class="search-box">
        <div class="title-search">
            <label>問卷名稱
                <!--  透過 Pinia 傳遞 -->
                <input v-model.trim="questionnaireName" type="text">
            </label>
        </div>
        <div class="time-search">
            <span>開始  /  結束</span>
            <input v-model="startingTime" type="date">
            <input v-model="endTime" type="date">
        </div>
        <button v-on:click="searchQuestionnaireFuzzy(questionnaireName,startingTime,endTime)">送出</button>
    </div>
</template>

<style lang="scss" scoped>
.search-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    
    button{
      padding: 10px;
    }
    
    .title-search {
        margin-bottom: 20px;
        input{
            margin-left: 20px;
        }
    }
    
    .time-search{
        margin-bottom: 20px;
        
    }
}
</style>