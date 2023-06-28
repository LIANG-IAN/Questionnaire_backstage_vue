<script>
import axios from "axios";

export default {
    data() {
        return {
            id: sessionStorage.getItem("id"),
            user: {},
            questionnaire: {},
            questionnaireContentList: [],
            optionArray: [],
            button: false,
            
            findByQuestionnaireId: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_ID,
            findAllByQuestionnaireId: import.meta.env.VITE_FIND_ALL_BY_QUESTIONNAIRE_ID,
        }
    },
    mounted() {
        axios.post(this.findByQuestionnaireId, {"id": this.id}).then(response => {
            this.questionnaire = response.data.questionnaire
            console.log(this.questionnaire)
        })
        
        axios.post(this.findAllByQuestionnaireId, {"questionnaireId": this.id}).then(response => {
            this.questionnaireContentList = response.data.questionnaireContentList;
            this.questionnaireContentList.forEach((questionnaireContent,) => {
                const temp = questionnaireContent.options.split(";")
                this.optionArray.push(temp);
            })
            console.log(this.questionnaireContentList)
            console.log(this.optionArray)
        })
    },
    methods: {
        setReadOnly(bol) {
            if (bol === 0) {
                const elements = document.querySelectorAll("input, select");
                elements.forEach(input => {
                    input.disabled = false;
                });
                this.button = false;
            }
            if (bol === 1) {
                const elements = document.querySelectorAll("input, select");
                elements.forEach(input => {
                    input.disabled = true;
                });
                this.button = true;
            }
        }
    },
}
</script>

<template>
    <div class="fill-questionnaire">
        <div class="time">
            {{ questionnaire.startingTime }} ~ {{ questionnaire.endTime }}
        </div>
        <h1 class="title">
            {{ questionnaire.questionnaire }}
        </h1>
        <h2 class="main-point">
            {{ questionnaire.mainPoint }}
        </h2>
        <div class="user-info">
            <div class="input-row">
                <label for="name">姓名</label>
                <input id="name" v-model="user.name" type="text">
            </div>
            
            <div class="input-row">
                <label for="tel">電話號碼</label>
                <input id="tel" v-model="user.tel" type="tel">
            </div>
            
            <div class="input-row">
                <label for="email">Email</label>
                <input id="email" v-model="user.email" type="email">
            </div>
            
            <div class="input-row">
                <label for="age">年齡</label>
                <input id="age" v-model="user.age" type="number">
            </div>
        </div>
        <div v-for="(content,quIndex) in questionnaireContentList" :key="quIndex" class="question-block">
            <span v-if="content.necessary">❗</span>
            <p>{{ content.question }}</p>
            
            <div v-if="content.type === 'text'" class="option-block">
                <template v-for="(option,opIndex) in optionArray[quIndex]"
                          :key="opIndex">
                    <p>{{ option }}</p>
                    <input required type="text">
                </template>
            </div>
            
            <div v-else-if="content.type === 'select'" class="option-block">
                <select>
                    <template v-for="(option,opIndex) in optionArray[quIndex]"
                              :key="opIndex">
                        <option value="">{{ option }}</option>
                    </template>
                </select>
            </div>
            
            <div v-else-if="content.type === 'checkbox'" class="option-block">
                <template v-for="(option,opIndex) in optionArray[quIndex]"
                          :key="opIndex">
                    <label for="">{{ option }}
                        <input id="" name="" type="checkbox">
                    </label>
                </template>
            </div>
        </div>
        <div class="button-block">
            <button v-if="button" type="button" @click="setReadOnly(0)">修改</button>
            <button v-if="button" type="button">送出</button>
            <button v-else type="button" @click="setReadOnly(1)">確認</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fill-questionnaire {
    
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 50%;
    padding: 30px 0;
    box-sizing: border-box;
    
    .time {
        width: 100%;
        text-align: right;
    }
    
    .title {
        font-size: 40px;
        line-height: 80px;
    }
    
    .main-point {
        font-size: 20px;
        line-height: 40px;
    }
    
    .user-info {
        width: 100%;
        
        .input-row {
            display: flex;
            height: 30px;
            width: 40%;
            margin-bottom: 10px;
            align-items: center;
            
            
            label {
                margin-right: 10px;
                font-size: 18px;
                width: 30%;
                
            }
            
            input {
                font-size: 18px;
                width: 70%;
            }
        }
    }
    
    .question-block {
        margin: 15px;
        font-size: 18px;
        
        span {
            font-size: 10px;
            line-height: 20px;
        }
        
        label {
            margin-right: 10px;
        }
        
        input {
            margin-top: 10px;
            font-size: 18px;
            margin-left: 0; //覆蓋原生
            
        }
        
        select {
            margin-top: 10px;
            font-size: 18px;
            
        }
    }
    
    .button-block {
        button {
            padding: 10px;
            margin: 10px;
        }
    }
}
</style>