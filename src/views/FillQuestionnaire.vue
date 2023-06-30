<script>
import axios from "axios";
import dayjs from 'dayjs'

export default {
    data() {
        return {
            id: sessionStorage.getItem("id"),
            user: {},
            questionnaire: {},
            questionnaireContentList: [],
            optionArray: [],
            button: false,
            answerContentArray: [],
            isEmpty: false,
            checkboxArray: [],
            
            
            findByQuestionnaireId: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_ID,
            findAllByQuestionnaireId: import.meta.env.VITE_FIND_ALL_BY_QUESTIONNAIRE_ID,
            addUser: import.meta.env.VITE_ADD_USER,
            addAnswerContent: import.meta.env.VITE_ADD_ANSWER_CONTENT,
            addAnswerRecord: import.meta.env.VITE_ADD_ANSWER_RECORD
        }
    },
    mounted() {
        axios.post(this.findByQuestionnaireId, {"id": this.id}).then(response => {
            this.questionnaire = response.data.questionnaire
            // console.log(this.questionnaire)
        })
        
        axios.post(this.findAllByQuestionnaireId, {"questionnaireId": this.id}).then(response => {
            this.questionnaireContentList = response.data.questionnaireContentList;
            this.questionnaireContentList.forEach((questionnaireContent,) => {
                const temp = questionnaireContent.options.split(";")
                this.optionArray.push(temp);
            })
            // console.log(this.questionnaireContentList)
            
            for (let i = 0; i < this.questionnaireContentList.length; i++) {
                const temp = {
                    user: {
                        id: 0
                    },
                    answer: "",
                    questionnaire: {
                        id: this.id
                    },
                    questionnaireContent: {
                        id: this.questionnaireContentList[i].id
                    }
                }
                this.answerContentArray.push(temp);
            }
            // console.log(this.answerContentArray)
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
        },
        
        
        judge() {
            const elements = document.querySelectorAll(".necessary");
            const checkboxes = document.querySelectorAll(".necessaryCheckbox");
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].value) {
                    elements[i].classList.remove("alert")
                    this.isEmpty = false;
                    continue;
                }
                elements[i].classList.add("alert")
                this.isEmpty = true;
            }
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    checkboxes[i].parentElement.parentElement.parentElement.classList.remove("alert")
                    this.isEmpty = false;
                    break;
                }
                checkboxes[i].parentElement.parentElement.parentElement.classList.add("alert")
                this.isEmpty = true;
            }
        },
        
        
        // 就是拿來塞方法的方法
        confirm() {
            this.setReadOnly(1);
            this.judge();
            this.getCheckbox();
            // console.log(this.answerContentArray)
        },
        
        
        getCheckbox() {
            const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            const groupedValues = {};
            
            checkedCheckboxes.forEach((checkbox) => {
                const dataCheckbox = checkbox.getAttribute("data-checkbox");
                const value = checkbox.value;
                
                if (dataCheckbox in groupedValues) {
                    groupedValues[dataCheckbox].push(value);
                }
                else {
                    groupedValues[dataCheckbox] = [value];
                }
            });
            this.answerContentArray.forEach((item, index) => {
                if (index in groupedValues) {
                    item.answer = groupedValues[index].join(';');
                }
            });
        },
        
        
        send() {
            axios.post(this.addUser, {"user": this.user}).then(response => {
                const userId = response.data.id;
                this.answerContentArray.forEach(answerContent => {
                    answerContent.user.id = userId;
                })
                
                axios.post(this.addAnswerContent, {"answerContentList": this.answerContentArray}).then(response => {
                    alert(response.data.message)
                    
                    if (response.data.message === "新增成功") {
                        const currentDate = dayjs();
                        const localDateTimeString = currentDate.format("YYYY-MM-DDTHH:mm:ss");
                        
                        const body = {
                            answerRecord: {
                                user: {
                                    id: userId
                                },
                                questionnaire: {
                                    id: this.id
                                },
                                fillingTime: localDateTimeString
                            }
                        }
                        axios.post(this.addAnswerRecord, body).then(response => {
                            console.log(response.data.message);
                        })
                    }
                })
            })
        },
        
        
        checkNum(){
            if (this.user.age < 0){
                this.user.age = null;
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
                <input id="name" v-model.trim="user.name" class="necessary" type="text">
            </div>
            
            <div class="input-row">
                <label for="tel">電話號碼</label>
                <input id="tel" v-model.trim="user.tel" class="necessary" type="tel">
            </div>
            
            <div class="input-row">
                <label for="email">Email</label>
                <input id="email" v-model.trim="user.email" class="necessary" type="email">
            </div>
            
            <div class="input-row">
                <label for="age">年齡</label>
                <input id="age" v-model.trim="user.age" class="necessary" type="number" min="0" @blur="checkNum">
            </div>
        </div>
        
        <div v-for="(content,quIndex) in questionnaireContentList" :key="quIndex" class="question-block">
            <span v-if="content.necessary">❗</span>
            <fieldset>
                <legend>{{ content.question }}</legend>
            <div v-if="content.type === 'text'" class="option-block">
                <template v-for="(option,opIndex) in optionArray[quIndex]"
                          :key="opIndex">
                    <p>{{ option }}</p>
                    <input v-model="answerContentArray[quIndex].answer" :class="content.necessary ? 'necessary' : ''" required type="text">
                </template>
            </div>
            
            <div v-else-if="content.type === 'select'" class="option-block">
                <select v-model="answerContentArray[quIndex].answer" :class="content.necessary ? 'necessary' : ''">
                    <template v-for="(option,opIndex) in optionArray[quIndex]"
                              :key="opIndex">
                        <option :value="option">{{ option }}</option>
                    </template>
                </select>
            </div>
            
            <div v-else-if="content.type === 'checkbox'" class="option-block">
                <template v-for="(option,opIndex) in optionArray[quIndex]"
                          :key="opIndex">
                    <label :for="option">{{ option }}
                        <input :id="option" :class="content.necessary ? 'necessaryCheckbox' : ''" :data-checkbox="quIndex"
                               :value="option" name="" type="checkbox">
                    </label>
                </template>
            </div>
            </fieldset>
        </div>
        <div class="button-block">
            <button v-if="button" type="button" @click="setReadOnly(0)">修改</button>
            <button v-if="button" :disabled="isEmpty" type="button" @click="send">送出</button>
            <button v-else type="button" @click="confirm">確認</button>
        </div>
        <button type="button" class="roll-back"><RouterLink to="/overview">回上一頁</RouterLink></button>
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
    position: relative;
    
    .time {
        width: 100%;
        text-align: right;
    }
    
    .title {
        font-size: 40px;
        line-height: 40px;
    }
    
    .main-point {
        font-size: 20px;
        line-height: 40px;
    }
    
    .user-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20px;
        
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
        width: 100%;
        text-align: center;
        line-height: 25px;
        position: relative;
        
        span{
            position: absolute;
            top: -15px;
            left: 5px;
        }
        
        fieldset{
            border: black 1px solid;
            
            legend{
                text-align: left;
                padding: 0 10px;
            }
        }
        
    }
    
    .button-block {
        button {
            padding: 10px;
            margin: 10px;
        }
    }
    
    .alert {
        box-shadow: 0 0 0 1px red;
    }
    
    .roll-back{
        position: fixed;
        right: 150px;
        bottom: 50px;
    }
}
</style>