<script>

import axios from "axios";

export default {
    data() {
        return {
            id: 11,
            optionAmount: [1], // 選項 Input
            questionAmount: 1,// 問題區塊
            questionnaireContentList: [
                {
                    question: "",
                    options: "",
                    necessary: false,
                    type: "text",
                    questionnaire: {
                        // TODO
                        // id: sessionStorage.getItem("id")
                        id: 11
                    }
                }
            ],
            optionArray: [[]],
            
            
            addQuestionnaireContent: import.meta.env.VITE_ADD_QUESTIONNAIRE_CONTENT,
            findAllByQuestionnaireId: import.meta.env.VITE_FIND_ALL_BY_QUESTIONNAIRE_ID
        }
    },
    methods: {
        plusQuestionAmount(item) {
            const questionnaire = {
                question: "",
                options: "",
                necessary: 0,
                type: "text",
                questionnaire: {
                    //TODO
                    // id: sessionStorage.getItem("id")
                    id: 11
                }
            };
            this.questionnaireContentList.push(questionnaire);
            this.optionAmount.push(1);
            this.optionArray.push([])
            item++;
            return item;
        },
        
        
        minusQuestionAmount(item) {
            this.questionnaireContentList.pop();
            this.optionAmount.pop();
            this.optionArray.pop();
            item--;
            if (item <= 0) {
                return item = 1;
            }
            return item;
        },
        
        
        plusOptionAmount(item) {
            item++;
            return item;
        },
        
        
        minusOptionAmount(item) {
            item--;
            if (item <= 0) {
                return item = 1;
            }
            return item;
        },
        
        
        minusInput(array) {
            return array.slice(0, 1);
        },
        
        
        // 送出 (新增)
        send() {
            axios.post(this.addQuestionnaireContent,{"questionnaireContentList":this.questionnaireContentList}).then(response=>{
                console.log(response.data.message)
            })
        },
        
        
    },
    mounted() {
        // 獲得所有題目
        axios.post(this.findAllByQuestionnaireId, {"questionnaireId": this.id}).then(response => {
            console.log(response.data)
        })
        
    },
    watch: {
        // 暫存
        questionnaireContentList: {
            handler() {
                const temp = JSON.stringify(this.questionnaireContentList);
                sessionStorage.setItem("questionnaireContentListObject", temp);
            },
            deep: true
        },
        optionArray: {
            handler() {
                this.questionnaireContentList.forEach((question, index) => {
                    question.options = this.optionArray[index].join(';');
                });
            },
            deep: true
        }
        
    }
}
</script>

<template>
    <div class="topic">
        <div v-for="(n,index) in questionAmount" :key="index" class="question-block">
            
            <!--  我是問題題目  -->
            <label :for="'question-' + index">問題</label>
            <input :id="`question-` + index" v-model="questionnaireContentList[index].question" type="text">
            
            <!--  是否必須  -->
            <label :for="'necessary-' + index">必須</label>
            <input :id="'necessary-' + index" v-model="questionnaireContentList[index].necessary" type="checkbox">
            
            
            <!--  我是加加、減減  -->
            <span v-if="questionnaireContentList[index].type !== 'text'"
                  @click="optionAmount[index] = plusOptionAmount(optionAmount[index])">＋</span>
            <span v-if="questionnaireContentList[index].type !== 'text'"
                  @click="optionAmount[index] = minusOptionAmount(optionAmount[index]);
                          optionArray[index] = minusInput(optionArray[index])">－</span>
            
            <!--  我是問題內容  -->
            <div class="option-block">
                <label for="answer">回答</label>
                <input v-for="(n, i) in optionAmount[index]" v-if="questionnaireContentList[index].type !== 'text'"
                       :key="i" v-model="optionArray[index][i]" type="text">
                <input v-else v-model="optionArray[index][0]" type="text">
            </div>
            
            <!--  我是問題類型  -->
            <select v-model="questionnaireContentList[index].type">
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
        
        <!--  我是加加、減減  -->
        <div class="symbol">
            <span @click="questionAmount = plusQuestionAmount(questionAmount)">＋</span>
            <span @click="questionAmount = minusQuestionAmount(questionAmount)">－</span>
        </div>
        <button type="button" @click="send">送出</button>
    </div>
</template>

<style lang="scss" scoped>
.topic {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .question-block {
        
        .option-block {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>