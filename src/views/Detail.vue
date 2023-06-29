<script>

import axios from "axios";

export default {
    data() {
        return {
            id: sessionStorage.getItem("id"),
            questionnaire: {},
            questionnaireContentList: [],
            optionArray: [],
            user: {},
            userId: sessionStorage.getItem("userId"),
            fillingTime: sessionStorage.getItem("fillingTime"),
            userAnswers: [],
            
            
            findByQuestionnaireId: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_ID,
            findAllByQuestionnaireId: import.meta.env.VITE_FIND_ALL_BY_QUESTIONNAIRE_ID,
            findByUserId: import.meta.env.VITE_FIND_BY_USER_ID,
            findByUserIdAndQuestionnaireId: import.meta.env.VITE_FIND_BY_USER_ID_AND_QUESTIONNAIRE_ID,
        }
    },
    mounted: function () {
        this.fillingTime = this.fillingTime.replace("T", " ")
        
        axios.post(this.findByQuestionnaireId, {"id": this.id}).then(response => {
            this.questionnaire = response.data.questionnaire
        })
        
        axios.post(this.findAllByQuestionnaireId, {"questionnaireId": this.id}).then(response => {
            this.questionnaireContentList = response.data.questionnaireContentList;
            this.questionnaireContentList.forEach((questionnaireContent,) => {
                const temp = questionnaireContent.options.split(";")
                this.optionArray.push(temp);
            })
        })
        
        axios.post(this.findByUserId, {"id": this.userId}).then(response => {
            this.user = response.data.user;
        })
        
        axios.post(this.findByUserIdAndQuestionnaireId, {
            "userId": this.userId,
            "questionnaireId": this.id
        }).then(response => {
            this.userAnswers = response.data.answerContentList;
            this.fillUserAnswers()
        })
    },
    methods: {
        getUserAnswer(questionId) {
            const userAnswer = this.userAnswers.find(answer => answer.questionnaireContent.id === questionId);
            console.log(userAnswer)
            return userAnswer ? userAnswer.answer : '';
        },
        isCheckboxChecked(questionId, option) {
            const userAnswer = this.userAnswers.find(answer => answer.questionnaireContent.id === questionId);
            return userAnswer && userAnswer.answer.includes(option);
        },
        fillUserAnswers() {
            const inputElements = document.querySelectorAll("[data-question-id]");
            inputElements.forEach(inputElement => {
                const questionId = inputElement.dataset.questionId;
                inputElement.value = this.getUserAnswer(questionId);
                if (inputElement.type === "checkbox") {
                    const option = inputElement.value;
                    inputElement.checked = this.isCheckboxChecked(questionId, option);
                }
            });
        }
    },
}
</script>

<template>
    <div class="detail">
        <div class="time">
            作答時間: {{ fillingTime }}
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
                <input id="name" v-model.trim="user.name" class="necessary" readonly type="text">
            </div>
            
            <div class="input-row">
                <label for="tel">電話號碼</label>
                <input id="tel" v-model.trim="user.tel" class="necessary" readonly type="tel">
            </div>
            
            <div class="input-row">
                <label for="email">Email</label>
                <input id="email" v-model.trim="user.email" class="necessary" readonly type="email">
            </div>
            
            <div class="input-row">
                <label for="age">年齡</label>
                <input id="age" v-model.trim="user.age" class="necessary" readonly type="number">
            </div>
        </div>
        <!--    -->
        <div v-for="(content, quIndex) in questionnaireContentList" :key="quIndex" class="question-block">
            <h3>{{ content.question }}</h3>
            
            <div v-if="content.type === 'text'" class="option-block">
                <template v-for="(option, opIndex) in optionArray[quIndex]" :key="opIndex">
                    <p>{{ option }}</p>
                    <input :data-question-id="content.id" :value="getUserAnswer(content.id)" readonly type="text">
                </template>
            </div>
            
            <div v-else-if="content.type === 'select'" class="option-block">
                <template v-for="(option, opIndex) in optionArray[quIndex]" :key="opIndex">
                    <input :id="opIndex" :checked="getUserAnswer(content.id) === option" :data-question-id="content.id" :name="content.question" :value="option"
                           disabled="disabled" type="radio">
                    <label :for="opIndex">{{ option }}</label>
                </template>
            </div>
            
            <div v-else-if="content.type === 'checkbox'" class="option-block">
                <template v-for="(option, opIndex) in optionArray[quIndex]" :key="opIndex">
                    <label :for="option">{{ option }}
                        <input :id="option" :checked="isCheckboxChecked(content.id, option)" :data-checkbox="quIndex" :data-question-id="content.id" :value="option"
                               disabled="disabled" type="checkbox">
                    </label>
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 600px;
    padding: 30px 20px;
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
        text-align: center;
        
        h3 {
            font-size: 20px;
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
}
input[type='radio']:after {
    width: 10px;
    height: 10px;
    border-radius: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: #ffffff;
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
}

input[type='radio']:checked:after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: #F18F01;
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
}

input[type='checkbox']:after {
    width: 10px;
    height: 10px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: #ffffff;
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
}

input[type='checkbox']:checked:after {
    width: 15px;
    height: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: #ffffff;
    content: '∨';
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
}

</style>