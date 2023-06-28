<script>

import axios from "axios";

export default {
    data() {
        return {
            id: sessionStorage.getItem("id"),
            answerRecordList: null,
            
            
            allByQuestionnaireIdFromAnswerRecordOrder: import.meta.env.VITE_FIND_ALL_BY_QUESTIONNAIRE_ID_FROM_ANSWER_RECORD_ORDER
        }
    },
    mounted() {
        axios.post(this.allByQuestionnaireIdFromAnswerRecordOrder, {"questionnaireId": this.id}).then(response => {
            console.log(response.data)
            this.answerRecordList = response.data.answerRecordList
        })
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
                    <td>{{ answerRecord.fillingTime }}</td>
                    <td>細節</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.feedback {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    
    .table-scroll {
        width: 100%;
        height: 400px;
        overflow: auto;
    }
    
    table {
        width: 100%;
        text-align: center;
        background-color: #fff;
        
        thead {
            th {
                width: 25%;
                background-color: #989898; /* 添加背景色 */
                position: sticky;
                top: 0;
                border: 1px solid white;
            }
        }
    }
}
</style>

