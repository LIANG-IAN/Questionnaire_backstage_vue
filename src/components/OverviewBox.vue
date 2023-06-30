<script>
import axios from 'axios';
import {useStore} from "@/stores/searchQuestionnaireFuzzyResult"

export default {
    data() {
        return {
            identity: sessionStorage.getItem("identity"), // 管理員與否
            path: "", // 路徑,
            questionnaireList: [], // 問卷,
            pageTotal: 1, // 頁數
            page: 1, // 當前頁數
            checkedList: [], // 被勾選問卷
            isChecked: false,
            
            
            findAll: import.meta.env.VITE_FIND_ALL,
            deleteQuestionnaire: import.meta.env.VITE_DELETE_QUESTIONNAIRE
            
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
            }
            else {
                this.checkedList.push(questionnaireId);
            }
        },
        
        
        // 刪除問卷
        deleteQuestion(questionnaireIdList) {
            axios.post(this.deleteQuestionnaire, {"idList": questionnaireIdList}).then(response => {
                alert(response.data.message);
                location.reload();
            })
        },
        
        
        // 紀錄點擊
        setSession(id) {
            sessionStorage.setItem("id", id);
        },
        
        
        // 跳轉頁面
        navigateTo(path) {
            this.$router.push(path);
        },
        
        
        // 清除 sessionStorage
        removeSession(item) {
            sessionStorage.removeItem(item);
        },
        
        // 計算頁數
        calculatePageTotal() {
            let dataTotal = this.questionnaireList.length;
            const perPage = 10;
            this.pageTotal = Math.ceil(dataTotal / perPage);
        }
    },
    async mounted() {
        //畫面一進來消除 sessionStorage
        sessionStorage.removeItem("id");
        
        
        // 取得所有問卷
        const response = await axios.get(this.findAll);
        this.questionnaireList = response.data.questionnaireList;
        
        
        // 監聽 Pinia Store 的變化，並更新問卷列表
        const store = useStore();
        this.$watch(() => store.searchQuestionnaireFuzzyResult, this.updateQuestionnaireList);
        
        
        this.calculatePageTotal();
    },
    computed: {
        // 管理員與否，決定路徑
        path() {
            return this.identity === "true" ? "/backstage" : "/fillQuestionnaire";
        },
        
    },
    watch: {
        questionnaireList: {
            immediate: true, // 立即觸發一次計算
            handler() {
                this.calculatePageTotal();
            }
        }
    }
}
</script>

<template>
    <div class="overview-box">
        <div class="symbol">
            <span v-show="identity === 'true'" class="delete-Questionnaire" @click="deleteQuestion(checkedList)">✖</span>
            <span v-show="identity === 'true'"
                  class="add-Questionnaire"
                  @click="navigateTo('/backstage/questionnaireManage'); removeSession(`questionnaireObject`); removeSession(`questionnaireContentListObject`)">✚</span>
        </div>
        <div class="table">
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
                <tr v-for="(questionnaire,index) in questionnaireList && questionnaireList.slice(page * 10 - 10, page * 10)"
                    :key="index">
                    <td v-show="identity === 'true'">
                        <input :checked="isChecked" :data-id="questionnaire.id" type="checkbox"
                               @click="check(questionnaire.id)">
                    </td>
                    <td>{{ questionnaire.id }}</td>
                    
                    
                    <!--   是否渲染 router-link   -->
                    <td v-if="getState(questionnaire) === '進行中'">
                        <router-link :data-id="questionnaire.id" :to="path" @click="setSession(questionnaire.id)">
                            {{ questionnaire.questionnaire }}
                        </router-link>
                    </td>
                    <td v-else-if="identity === 'true'">
                        <router-link :data-id="questionnaire.id" :to="path" @click="setSession(questionnaire.id)">
                            {{ questionnaire.questionnaire }}
                        </router-link>
                    </td>
                    <td v-else>{{ questionnaire.questionnaire }}</td>
                    
                    
                    <td v-text="getState(questionnaire)"></td>
                    <td>{{ questionnaire.startingTime }}</td>
                    <td>{{ questionnaire.endTime }}</td>
                    
                    
                    <!--   是否渲染 router-link   -->
                    <td v-if="getState(questionnaire) !== '尚未開始'">
                        <router-link :data-id="questionnaire.id" to="/result">結果</router-link>
                    </td>
                    <td v-else>結果</td>
                
                </tr>
                </tbody>
            </table>
        </div>
        <div class="page-item">
            <span v-for="(page,index) in pageTotal" :key="index" v-on:click="pagination">{{ page }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.overview-box {
    height: 70%;
    width: 60%;
    
    .symbol{
       font-size: 25px;
        font-weight: bold;
        padding-bottom: 3px;
        
        span{
            padding-left: 5px;
            cursor: pointer;
            transition: 0.2s;
            display: inline-block;
            
            &:hover{
                scale: 1.2;
            }
        }
        
        .delete-Questionnaire{
            color: #F18F01;
            
            &:hover{
                color: red;
            }
        }
        .add-Questionnaire{
            color: #99C24D;
            
            &:hover{
                color: green;
            }
        }
    }
    
    .table{
        height: 90%;
        
    table {
        text-align: center;
        width: 100%;
        border-collapse: collapse;
        color: white;
        
        th {
            background-color: #048BA8;
            width: 25vw;
            height: 40px;
            vertical-align: middle;
        }
        
        td {
            background-color: #363636;
            width: 25vw;
            height: 40px;
            text-align: center;
            transition: all 0.3s ease-in-out;
            vertical-align: middle;
            
        }
        
        tr:hover td {
            background-color: #2E4057;
            transition: all 0.3s ease-in-out;
        }
        
        tr td:first-child {
            color: rgba(79, 192, 210, 0.6);
            border-left: 5px solid rgba(79, 192, 210, 0.6);
            transition: all 0.3s ease-in-out;
        }
        
        tr:hover td:first-child {
            color: rgba(79, 192, 210, 1);
            border-left: 5px solid rgba(79, 192, 210, 1);
            transition: all 0.3s ease-in-out;
        }
        
        tr {
            border-bottom: 1px solid #2a2a2a;
        }
        
        tr:last-of-type {
            border-bottom: none;
        }
    }
    }
    .page-item {
        text-align: center;
        font-size: 25px;
        
        span {
            margin: 0 5px;
            cursor: pointer;
            font-weight: bold;
            
            &:hover {
                text-shadow: white 1px 1px 3px;
            }
        }
        
    }
}

</style>