<script>

import axios from "axios";

export default {
    data() {
        return {
            id: sessionStorage.getItem("id"),
            answerRecordList: null,
            userId: 0,
            
            findAllByQuestionnaireIdFromAnswerRecordOrder: import.meta.env.VITE_FIND_ALL_BY_QUESTIONNAIRE_ID_FROM_ANSWER_RECORD_ORDER
        }
    },
    mounted() {
        this.clearSession();
        
        axios.post(this.findAllByQuestionnaireIdFromAnswerRecordOrder, {"questionnaireId": this.id}).then(response => {
            this.answerRecordList = response.data.answerRecordList
        })
    },
    methods: {
        setSession(id, time) {
            sessionStorage.setItem("userId", id);
            sessionStorage.setItem("fillingTime", time);
            
            this.$router.push({
                name: "detail",
                params: {
                    userId: id
                }
            })
        },
        
        clearSession() {
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("fillingTime");
        }
    }
    
}
</script>

<template>
    <div class="feedback">
        <div class="table-scroll">
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>姓名</th>
                    <th>填寫時間</th>
                    <th>觀看細節</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="answerRecord in answerRecordList">
                    <td>{{ answerRecord.id }}</td>
                    <td>{{ answerRecord.user.name }}</td>
                    <td>{{ answerRecord.fillingTime.replace("T", " ") }}</td>
                    <td class="detail" @click="setSession(answerRecord.user.id,answerRecord.fillingTime)">細節</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.feedback {
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    
    .table-scroll {
        width: 100%;
        height: 100%;
        overflow: auto;
        line-height: 25px;
        font-size: 18px;
        
        table {
            width: 100%;
            text-align: center;
            background-color: #2e4057;
            
            .detail{
                cursor: pointer;
            }
            
            thead {
                
                th {
                    width: 25%;
                    background-color: #989898; /* 添加背景色 */
                    position: sticky;
                    top: 0;
                    border-top: white 1px solid;
                }
            }
            
        }
    }
}
</style>

