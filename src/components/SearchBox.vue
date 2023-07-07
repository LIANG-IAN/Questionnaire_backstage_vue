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
            findByStartingTime: import.meta.env.VITE_FIND_BY_STARTING_TIME,
            findByEndTime: import.meta.env.VITE_FIND_BY_END_TIME,
            findByStartingTimeBetween: import.meta.env.VITE_FIND_BY_STARTING_TIME_BETWEEN,
            findByQuestionnaireFuzzySearchAndStartingTimeThanEqual: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_FUZZY_SEARCH_AND_STARTING_TIME_THAN_EQUAL,
            findByQuestionnaireFuzzySearchAndEndTimeLessThanEqual: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_FUZZY_SEARCH_AND_END_TIME_LESS_THAN_EQUAL,
            findByQuestionnaireFuzzySearchStartingTimeThanEqualAndEndTimeLessThanEqual: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_FUZZY_SEARCH_STARTING_TIME_THAN_EQUAL_AND_END_TIME_LESS_THAN_EQUAL
        }
    },
    methods: {
        // 模糊搜尋問卷
        searchQuestionnaireFuzzy(name, startingTime, endTime) {
            if (name && name.trim() !== "" && startingTime !== "" && endTime !== "") {
                axios.post(this.findByQuestionnaireFuzzySearchStartingTimeThanEqualAndEndTimeLessThanEqual, {
                    "questionnaire": name,
                    "startingTime": startingTime,
                    "endTime": endTime
                }).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (name && name.trim() !== "" && startingTime !== "") {
                axios.post(this.findByQuestionnaireFuzzySearchAndStartingTimeThanEqual, {
                    "questionnaire": name,
                    "startingTime": startingTime
                }).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (name && name.trim() !== "" && endTime !== "") {
                axios.post(this.findByQuestionnaireFuzzySearchAndEndTimeLessThanEqual, {
                    "questionnaire": name,
                    "endTime": endTime
                }).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (name && name.trim() !== "") {
                axios.post(this.findByQuestionnaireFuzzySearch, {"questionnaire": name}).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (startingTime !== "" && endTime === "") {
                axios.post(this.findByStartingTime, {"startingTime": startingTime}).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (startingTime === "" && endTime !== "") {
                axios.post(this.findByEndTime, {"endTime": endTime}).then(response => {
                    this.questionnaireList = response.data.questionnaireList;
                })
            }
            else if (startingTime !== "" && endTime !== "") {
                axios.post(this.findByStartingTimeBetween, {
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
    
    button {
        padding: 10px;
    }
    
    .title-search {
        margin-bottom: 20px;
        
        input {
            margin-left: 20px;
        }
    }
    
    .time-search {
        margin-bottom: 20px;
        
    }
}
</style>