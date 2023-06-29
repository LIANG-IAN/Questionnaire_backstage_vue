<script>
import axios from "axios";

export default {
    data() {
        return {
            id: sessionStorage.getItem("id"),
            optionAmount: [1], // 選項 Input
            questionAmount: 1, // 問題區塊
            questionnaireContentList: [
                {
                    question: "",
                    options: "",
                    necessary: false,
                    type: "text",
                    questionnaire: {
                        id: sessionStorage.getItem("id"),
                    },
                },
            ],
            optionArray: [[]],
            deletedQuestionIds: [], // 儲存被刪除的 question-block 的 id
            
            addQuestionnaireContent: import.meta.env.VITE_ADD_QUESTIONNAIRE_CONTENT,
            deleteQuestionnaireContent: import.meta.env.VITE_DELETE_QUESTIONNAIRE_CONTENT,
            findAllByQuestionnaireId: import.meta.env.VITE_FIND_ALL_BY_QUESTIONNAIRE_ID,
            addQuestionnaire: import.meta.env.VITE_ADD_QUESTIONNAIRE,
        };
    },
    methods: {
        initializeOptionArray() {
            this.optionArray = this.questionnaireContentList.map(() => [""]);
        },
        
        plusQuestionAmount(item) {
            const questionnaire = {
                question: "",
                options: "",
                necessary: false,
                type: "text",
                questionnaire: {
                    id: sessionStorage.getItem("id"),
                },
            };
            this.questionnaireContentList.push(questionnaire);
            this.optionAmount.push(1);
            this.optionArray.push([""]);
            
            item++;
            return item;
        },
        
        minusQuestionAmount(item) {
            const deletedQuestion = this.questionnaireContentList.pop();
            if (deletedQuestion) {
                this.deletedQuestionIds.push(deletedQuestion.id);
            }
            console.log(deletedQuestion)
            this.optionAmount.pop();
            this.optionArray.pop();
            item--;
            if (item <= 0) {
                return (item = 1);
            }
            return item;
        },
        
        plusOptionAmount(index) {
            this.optionArray[index].push("");
            return this.optionArray[index].length;
        },
        
        minusOptionAmount(index) {
            this.optionArray[index].pop();
            if (this.optionArray[index].length <= 0) {
                this.optionArray[index].push("");
            }
            return this.optionArray[index].length;
        },
        
        
        delete() {
            axios.post(this.deleteQuestionnaireContent, {"idList": this.deletedQuestionIds}).then(response => {
            })
        },
        
        // 送出 (新增)
        async send() {
            if (this.id === null) {
                const storedQuestionnaire = sessionStorage.getItem("questionnaireObject");
                if (storedQuestionnaire) {
                    const questionnaire = JSON.parse(storedQuestionnaire);
                    await axios.post(this.addQuestionnaire, {questionnaire: questionnaire}).then(response => {
                        alert("新增Questionnaire: " + response.data.message);
                        this.id = response.data.questionnaire.id;
                        sessionStorage.setItem("id", this.id)
                    })
                }
                else {
                    alert("請回上頁新增問卷")
                }
            }
            const id = sessionStorage.getItem("id")
            this.questionnaireContentList.forEach(function (questionnaireContent, index) {
                questionnaireContent.questionnaire.id = id;
            })
            axios.post(this.addQuestionnaireContent, {
                questionnaireContentList: this.questionnaireContentList,
            }).then((response) => {
                alert("新增QuestionnaireContent: " + response.data.message);
            });
        },
        
        sendAndDelete() {
            this.send();
            this.delete();
            
        }
    },
    mounted() {
        if (this.id !== null) {
            axios
                .post(this.findAllByQuestionnaireId, {questionnaireId: sessionStorage.getItem("id")})
                .then((response) => {
                        if (response.data.message === "尋找成功") {
                            this.questionnaireContentList = response.data.questionnaireContentList;
                            this.questionAmount = this.questionnaireContentList.length;
                            this.initializeOptionArray();
                            this.questionnaireContentList.forEach((question, index) => {
                                if (question.options) {
                                    this.optionArray[index] = question.options.split(";");
                                }
                            });
                        }
                    }
                );
        }
        else {
            const questionnaireContentList = sessionStorage.getItem(
                "questionnaireContentListObject"
            );
            if (questionnaireContentList) {
                this.questionnaireContentList = JSON.parse(questionnaireContentList);
                this.questionAmount = this.questionnaireContentList.length;
                this.initializeOptionArray();
                this.questionnaireContentList.forEach((question, index) => {
                    if (question.options) {
                        this.optionArray[index] = question.options.split(";");
                    }
                });
            }
            else {
                this.initializeOptionArray();
            }
        }
    },
    watch: {
        // 暫存
        questionnaireContentList: {
            handler(newValue, oldValue) {
                this.questionnaireContentList.forEach((question, index) => {
                    // 當問卷類型為 'text' 時，清空選項
                    if (question.type === 'text') {
                        this.optionArray[index] = [];
                        question.options = '';
                    }
                    else if (!Array.isArray(this.optionArray[index])) {
                        // 當選項數組不存在或不是數組時，進行初始化
                        this.optionArray[index] = [''];
                    }
                    
                    
                });
                
                const temp = JSON.stringify(this.questionnaireContentList);
                sessionStorage.setItem("questionnaireContentListObject", temp);
            },
            deep: true,
        },
        
        // 即時轉換 input 內容
        optionArray: {
            handler() {
                this.questionnaireContentList.forEach((question, index) => {
                    if (this.optionArray[index]) {
                        question.options = this.optionArray[index].join(";");
                    }
                });
            },
            deep: true,
        },
    },
};
</script>

<template>
    <div class="topic">
        <div v-for="(question, index) in questionnaireContentList" :key="index" class="question-block">
            <!-- 我是問題題目 -->
            <div class="question">
                <label :for="'question-' + index">問題
                <input :id="`question-` + index" v-model="question.question" type="text"/>
                </label>
            </div>
            
            <!-- 是否必須 -->
            <div class="necessary-block">
                <label :for="'necessary-' + index">必須
                <input :id="'necessary-' + index" v-model="question.necessary" type="checkbox"/>
            </label>
            </div>
            
            <!-- 我是加加、減減 -->
            <div class="symbol-block">
                <span v-if="question.type !== 'text'" @click="optionAmount[index] = plusOptionAmount(index)" class="plus">＋</span>
                <span v-if="question.type !== 'text'"
                      @click="optionAmount[index] = minusOptionAmount(index)" class="minus">－</span>
            </div>
            
            <!-- 我是問題內容 -->
            <div class="option-block">
                <label :for="'answer'+index">回答</label>
                    <div>
                        <input v-for="(option, optionIndex) in optionArray[index]" v-if="question.type !== 'text'"
                              :key="optionIndex" v-model="optionArray[index][optionIndex]" type="text"/>
                    </div>
                
            </div>
            
            <!-- 我是問題類型 -->
            <div class="select-block">
                <select v-model="question.type">
                    <option value="text">簡答</option>
                    <option value="select">選擇題</option>
                    <option value="checkbox">核取方塊</option>
                </select>
            </div>
        </div>
        
        <!-- 我是加加、減減 -->
        <div class="symbol">
            <span @click="questionAmount = plusQuestionAmount(questionAmount)" class="plus">＋</span>
            <span @click="questionAmount = minusQuestionAmount(questionAmount)" class="minus">－</span>
        </div>
        <div class="send">
            <button type="button" @click="sendAndDelete">送出</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.topic {
    display: flex;
    flex-direction: column;
    justify-content: start;
    height: 600px;
    overflow: auto;
    padding-top: 20px;
    
    .question-block {
        padding: 0 0 10px 0;
        margin: 0 20px 0 20px;
        border-bottom: 1px black dashed;
        
        .question{
            padding-top: 15px;
        }
        
        .option-block{
            
            input{
                margin-top: 10px;
            }
        }
        
        .necessary-block{
            padding-top: 15px;
        }
        
        .symbol-block{
            padding-top: 5px;
            height: 20px;
            font-weight: bold;
            
            .plus{
                color: #99C24D;
                display: inline-block;
                
                &:hover{
                    color: green;
                    scale: 1.2;
                }
            }
            
            .minus{
                color: #F18F01;
                display: inline-block;
                
                &:hover{
                    color: red;
                    scale: 1.2;
                }
            }
        }
        
        .select-block{
            padding-top: 15px;
        }
        
    }
    
    .symbol{
        padding-top: 10px;
        padding-left:20px ;
        font-weight: bold;
        font-size: 18px;
        
        .plus{
            color: #99C24D;
            display: inline-block;
            
            &:hover{
                color: green;
                scale: 1.2;
            }
        }
        
        .minus{
            color: #F18F01;
            display: inline-block;
            
            &:hover{
                color: red;
                scale: 1.2;
            }
        }
    }
    
    .send {
        text-align: center;
        
        button {
            width: 200px;
            margin-bottom: 50px;
        }
    }
    
}
</style>
